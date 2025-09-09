from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from .agent import run_agent_query
from .config import check_environment_health, EnvironmentError

app = FastAPI(title="LangChain Chat API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="frontend"), name="static")

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Chat endpoint that processes messages through the LangChain agent.
    """
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        agent_response = run_agent_query(request.message)
        
        return ChatResponse(
            response=agent_response,
            conversation_id=request.conversation_id
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    try:
        env_health = check_environment_health()
        
        if env_health['environment_valid']:
            return {
                "status": "healthy", 
                "message": "LangChain Chat API is running",
                "quickbooks_enabled": True,
                "environment": "configured"
            }
        else:
            return {
                "status": "degraded",
                "message": "LangChain Chat API is running but environment is incomplete",
                "quickbooks_enabled": False,
                "environment": "incomplete",
                "missing_variables": [k for k, v in env_health['variables'].items() if not v],
                "setup_required": env_health.get('setup_url')
            }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Health check failed: {str(e)}",
            "quickbooks_enabled": False
        }

@app.get("/api/environment")
async def environment_status():
    """Check environment variable configuration status."""
    try:
        env_health = check_environment_health()
        return {
            "environment_valid": env_health['environment_valid'],
            "variables": env_health['variables'],
            "missing_count": env_health['missing_count'],
            "setup_instructions": {
                "pica_setup": "Get your PICA_API_KEY from https://app.picaos.com",
                "quickbooks_setup": "Set up QuickBooks connection at https://app.picaos.com/connections",
                "openai_setup": "Get your OpenAI API key from https://platform.openai.com/api-keys"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check environment: {str(e)}")

@app.get("/")
async def root():
    """Serve the main chat interface."""
    from fastapi.responses import FileResponse
    return FileResponse("frontend/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
