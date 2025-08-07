"""
PicaAgentService - Pica Integration for Agno Workflows

This service provides a clean interface between Agno's workflow system
and Pica's platform integrations using the official pica_langchain package.
"""

import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain.agents import AgentType
from pica_langchain import PicaClient, create_pica_agent
from pica_langchain.models import PicaClientOptions

load_dotenv()


class PicaAgentService:
    """
    Service class that provides proper Pica integration for Agno workflows.
    
    """
    
    def __init__(self, 
                 pica_secret: Optional[str] = None,
                 openai_api_key: Optional[str] = None,
                 model: str = "gpt-4o",
                 temperature: float = 0,
                 server_url: str = "https://api.picaos.com",
                 verbose: bool = True):
        """
        Initialize the Pica agent service.
        
        Args:
            pica_secret: Pica API secret key
            openai_api_key: OpenAI API key  
            model: OpenAI model to use
            temperature: LLM temperature setting
            server_url: Pica server URL
            verbose: Enable verbose logging
        """
        self.pica_secret = pica_secret or os.getenv("PICA_SECRET")
        self.openai_api_key = openai_api_key or os.getenv("OPENAI_API_KEY")
        self.verbose = verbose
        
        if not self.pica_secret:
            raise ValueError("PICA_SECRET is required but not found in environment variables")
            
        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY is required but not found in environment variables")
        
        self.pica_client = PicaClient(
            secret=self.pica_secret,
            options=PicaClientOptions(
                connectors=["*"],  
                server_url=server_url
            )
        )
        
        self.llm = ChatOpenAI(
            temperature=temperature,
            model=model,
            openai_api_key=self.openai_api_key
        )
        
        self.pica_agent = create_pica_agent(
            client=self.pica_client,
            llm=self.llm,
            agent_type=AgentType.OPENAI_FUNCTIONS,
            verbose=self.verbose
        )
    
    def execute_task(self, task_description: str) -> Dict[str, Any]:
        """
        Execute a task through Pica's platform integrations.
        
        Args:
            task_description: Natural language description of the task to execute
            
        Returns:
            Dictionary containing the execution result and metadata
        """
        try:
            if self.verbose:
                print(f"🔄 Executing Pica task: {task_description[:100]}...")
            
            result = self.pica_agent.invoke({"input": task_description})
            
            if self.verbose:
                print("✅ Pica task completed successfully")
            
            return {
                "success": True,
                "result": result,
                "task": task_description,
                "execution_method": "pica_langchain"
            }
            
        except Exception as e:
            error_msg = str(e)
            if self.verbose:
                print(f"❌ Pica task failed: {error_msg}")
                
            return {
                "success": False,
                "error": error_msg,
                "task": task_description,
                "execution_method": "pica_langchain"
            }
    
    def execute_email_task(self, task_description: str) -> str:
        """
        Execute an email-related task through Gmail integration.
        
        Args:
            task_description: Email task description
            
        Returns:
            Formatted result string
        """
        if "gmail" not in task_description.lower():
            task_description += " using Gmail"
            
        result = self.execute_task(task_description)
        return self._format_task_result(result, "Email")
    
    def execute_task_management(self, task_description: str) -> str:
        """
        Execute a task management operation through Linear/Notion integration.
        
        Args:
            task_description: Task management operation description
            
        Returns:
            Formatted result string
        """
        platforms = ["linear", "notion"]
        has_platform = any(platform in task_description.lower() for platform in platforms)
        
        if not has_platform:
            task_description += " using Linear"
            
        result = self.execute_task(task_description)
        return self._format_task_result(result, "Task Management")
    
    def execute_data_operation(self, task_description: str) -> str:
        """
        Execute a data operation through Airtable/Notion integration.
        
        Args:
            task_description: Data operation description
            
        Returns:
            Formatted result string
        """
        platforms = ["airtable", "notion", "google-sheets"]
        has_platform = any(platform in task_description.lower() for platform in platforms)
        
        if not has_platform:
            task_description += " using Airtable"
            
        result = self.execute_task(task_description)
        return self._format_task_result(result, "Data Operation")
    
    def execute_calendar_task(self, task_description: str) -> str:
        """
        Execute a calendar operation through Google Calendar integration.
        
        Args:
            task_description: Calendar task description
            
        Returns:
            Formatted result string
        """
        if "google calendar" not in task_description.lower() and "calendar" not in task_description.lower():
            task_description += " using Google Calendar"
            
        result = self.execute_task(task_description)
        return self._format_task_result(result, "Calendar")
    
    def _format_task_result(self, result: Dict[str, Any], task_type: str) -> str:
        """
        Format task execution result for display.
        
        Args:
            result: Task execution result
            task_type: Type of task (Email, Task Management, etc.)
            
        Returns:
            Formatted result string
        """
        if result["success"]:
            task_result = result.get("result", {})
            output = task_result.get("output", "") if isinstance(task_result, dict) else str(task_result)
            
            return f"✅ {task_type} task completed successfully\n" \
                   f"Task: {result['task']}\n" \
                   f"Result: {output}"
        else:
            return f"❌ {task_type} task failed\n" \
                   f"Task: {result['task']}\n" \
                   f"Error: {result['error']}"
    
    def get_connected_platforms(self) -> Dict[str, Any]:
        """
        Get information about connected platforms.
        
        Returns:
            Dictionary with platform connection information
        """
        try:
            
            return {
                "success": True,
                "connected_platforms": [],  
                "platform_count": 0,
                "message": "Connected platforms available through Pica client"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "connected_platforms": [],
                "platform_count": 0
            }
    
    def test_connection(self) -> Dict[str, Any]:
        """
        Test the Pica connection and return status.
        
        Returns:
            Dictionary with connection test results
        """
        try:
            test_result = self.execute_task("List available platforms and connections")
            
            return {
                "success": test_result["success"],
                "pica_secret_configured": bool(self.pica_secret),
                "openai_configured": bool(self.openai_api_key),
                "agent_created": bool(self.pica_agent),
                "test_result": test_result
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "pica_secret_configured": bool(self.pica_secret),
                "openai_configured": bool(self.openai_api_key),
                "agent_created": False
            }


_pica_service = None

def get_pica_service() -> PicaAgentService:
    """Get or create the global Pica agent service instance."""
    global _pica_service
    if _pica_service is None:
        _pica_service = PicaAgentService()
    return _pica_service


def execute_pica_task(task_description: str, platform_hint: Optional[str] = None) -> str:
    """
    Convenience function to execute a Pica task using the global service instance.
    
    Args:
        task_description: Natural language task description
        platform_hint: Optional platform preference
        
    Returns:
        Formatted result string
    """
    try:
        service = get_pica_service()
        
        if platform_hint:
            if platform_hint.lower() not in task_description.lower():
                task_description += f" using {platform_hint}"
        
        result = service.execute_task(task_description)
        return service._format_task_result(result, "Platform Task")
        
    except Exception as e:
        return f"❌ Failed to execute Pica task: {str(e)}"


def test_pica_connection() -> Dict[str, Any]:
    """
    Test Pica connection using the global service instance.
    
    Returns:
        Connection test results in the format expected by the workflow
    """
    try:
        service = get_pica_service()
        connection_result = service.test_connection()
        
        return {
            "success": connection_result["success"],
            "connected_platforms": [],  
            "platform_count": 0, 
            "pica_secret_configured": connection_result.get("pica_secret_configured", False),
            "openai_configured": connection_result.get("openai_configured", False),
            "agent_created": connection_result.get("agent_created", False),
            "error": connection_result.get("error", "") if not connection_result["success"] else None
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to initialize Pica service: {str(e)}",
            "connected_platforms": [],
            "platform_count": 0,
            "pica_secret_configured": False,
            "openai_configured": False,
            "agent_created": False
        }


if __name__ == "__main__":
    """Test the Pica agent service when run directly."""
    print("🧪 Testing Pica Agent Service")
    print("=" * 50)
    
    try:
        service = PicaAgentService()
        
        connection_test = service.test_connection()
        print(f"Connection Test: {'✅ Success' if connection_test['success'] else '❌ Failed'}")
        
        if connection_test['success']:
            test_task = "List all available platforms and their connection status"
            print(f"\nTesting task: {test_task}")
            result = service.execute_task(test_task)
            print(f"Result: {result}")
        else:
            print(f"Connection failed: {connection_test.get('error', 'Unknown error')}")
            
    except Exception as e:
        print(f"❌ Service initialization failed: {str(e)}")
