from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI(title="RUPAIYA API")
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ChatContext(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    income: Optional[str] = None
    goal: Optional[str] = None
    goalAmount: Optional[int] = None
    savedAmount: Optional[int] = None
    totalSpent: Optional[int] = None
    topCategories: Optional[Dict[str, int]] = None
    circlesCount: Optional[int] = None
    monthlyCommitment: Optional[int] = None
    totalInvested: Optional[int] = None


class ChatRequest(BaseModel):
    session_id: str
    message: str
    context: Optional[ChatContext] = None
    use_case: Optional[str] = "chat"  # chat | home_nudge | bid_advice | invest_advice


class ChatResponse(BaseModel):
    reply: str
    session_id: str


def build_system_message(ctx: Optional[ChatContext], use_case: str) -> str:
    base = (
        "You are RUPAIYA, a warm, friendly Indian AI money companion that speaks in Hinglish "
        "(natural mix of Hindi and English written in Roman script). You help middle-income "
        "Indian users save, invest wisely, and manage community savings circles (committee/chit fund). "
        "Rules:\n"
        "- Keep replies under 90 words, conversational, like a trusted elder cousin.\n"
        "- Always include specific rupee amounts when relevant.\n"
        "- Use emojis naturally (1-3 per reply).\n"
        "- Never use jargon like NAV, CAGR, expense ratio, arbitrage.\n"
        "- End with a short question or next step.\n"
        "- Respond in Hinglish (Roman Hindi + English words), not pure Hindi.\n"
    )
    if ctx:
        base += "\nUser profile:\n"
        if ctx.name: base += f"- Name: {ctx.name}\n"
        if ctx.city: base += f"- City: {ctx.city}\n"
        if ctx.income: base += f"- Monthly income range: {ctx.income}\n"
        if ctx.goal: base += f"- Savings goal: {ctx.goal} (target ₹{ctx.goalAmount or 0}, saved ₹{ctx.savedAmount or 0} so far)\n"
        if ctx.totalSpent is not None: base += f"- This month spent: ₹{ctx.totalSpent}\n"
        if ctx.topCategories:
            cats = ", ".join([f"{k}: ₹{v}" for k, v in list(ctx.topCategories.items())[:3]])
            base += f"- Top spending: {cats}\n"
        if ctx.circlesCount is not None: base += f"- Active circles: {ctx.circlesCount} (monthly commitment ₹{ctx.monthlyCommitment or 0})\n"
        if ctx.totalInvested is not None: base += f"- Total invested: ₹{ctx.totalInvested}\n"

    if use_case == "home_nudge":
        base += "\nTask: Give ONE specific, actionable money tip based on this user's spending or savings pattern. Be encouraging, not preachy. Start with 'Bhai' or 'Yaar' or the user's name."
    elif use_case == "bid_advice":
        base += "\nTask: Advise on whether to bid this month in their committee/circle, and suggest a smart bid amount with reasoning in simple terms."
    elif use_case == "invest_advice":
        base += "\nTask: Recommend one of Digital Gold, Short FD, or Liquid Fund for this user and explain why in simple Hinglish."
    return base


@api_router.get("/")
async def root():
    return {"message": "RUPAIYA API live ✨"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for r in rows:
        if isinstance(r.get('timestamp'), str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
    return rows


@api_router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    system_msg = build_system_message(req.context, req.use_case or "chat")

    try:
        chat_client = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=req.session_id,
            system_message=system_msg,
        ).with_model("gemini", "gemini-2.5-flash")

        reply = await chat_client.send_message(UserMessage(text=req.message))

        # persist
        doc = {
            "session_id": req.session_id,
            "message": req.message,
            "reply": reply,
            "use_case": req.use_case,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        await db.chat_messages.insert_one(doc)

        return ChatResponse(reply=reply, session_id=req.session_id)
    except Exception as e:
        logging.exception("chat error")
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


@api_router.get("/chat/history/{session_id}")
async def chat_history(session_id: str):
    rows = await db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("timestamp", 1).to_list(200)
    return rows


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
