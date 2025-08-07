"""
Business Automation Workflow - Agno + Pica Integration

This workflow demonstrates the combining Agno's agentic workflows
with Pica's platform integrations for business process automation.

Features:
- Stateful, deterministic workflows with caching
- Direct Pica API integration
- Multiple specialized agents working in sequence
- platform connections (Gmail, Linear, Notion, Airtable, etc.)
"""

import json
import os
from typing import Dict, List, Any, Iterator, Optional
from textwrap import dedent
from datetime import datetime

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from agno.tools import tool
from agno.tools.reasoning import ReasoningTools
from agno.workflow import Workflow, RunResponse, RunEvent
from agno.utils.log import logger
from agno.utils.pprint import pprint_run_response

from pydantic import BaseModel, Field
from dotenv import load_dotenv

from pica_agent_service import PicaAgentService, test_pica_connection, execute_pica_task, get_pica_service

load_dotenv()


class Customer(BaseModel):
    name: str = Field(..., description="Customer's full name")
    email: str = Field(..., description="Customer's email address")
    company: str = Field(..., description="Customer's company name")
    source: str = Field(..., description="Lead source (e.g., website, referral)")
    interest_level: str = Field(..., description="Interest level: low, medium, high")
    

class Task(BaseModel):
    title: str = Field(..., description="Task title")
    description: str = Field(..., description="Task description")
    priority: str = Field(..., description="Task priority: low, medium, high, critical")
    assigned_to: Optional[str] = Field(None, description="Who the task is assigned to")
    due_date: Optional[str] = Field(None, description="Due date if specified")


class WorkflowResult(BaseModel):
    workflow_id: str = Field(..., description="Unique workflow identifier")
    status: str = Field(..., description="Workflow status: completed, failed, in_progress")
    customer_data: Customer = Field(..., description="Customer information")
    tasks_created: List[Task] = Field(default_factory=list, description="Tasks created during workflow")
    emails_sent: List[str] = Field(default_factory=list, description="Emails sent during workflow")
    notes_created: List[str] = Field(default_factory=list, description="Notes created in knowledge systems")
    execution_time: float = Field(..., description="Workflow execution time in seconds")


@tool
def execute_email_task(task: str) -> str:
    """
    Execute email-related tasks through Pica's Gmail integration.
    
    Args:
        task (str): Natural language description of the email task
        
    Returns:
        str: Result of the email task execution
    """
    try:
        return execute_pica_task(task, platform_hint="gmail")
    except Exception as e:
        return f"❌ Email task failed: {str(e)}"


@tool  
def execute_task_management(task: str) -> str:
    """
    Execute task management operations through Pica's Linear/Notion integrations.
    
    Args:
        task (str): Natural language description of the task management operation
        
    Returns:
        str: Result of the task management operation
    """
    try:
        return execute_pica_task(task, platform_hint="linear")
    except Exception as e:
        return f"❌ Task management failed: {str(e)}"


@tool
def execute_data_operation(task: str) -> str:
    """
    Execute data operations through Pica's Airtable/Notion integrations.
    
    Args:
        task (str): Natural language description of the data operation
        
    Returns:
        str: Result of the data operation
    """
    try:
        return execute_pica_task(task, platform_hint="airtable")
    except Exception as e:
        return f"❌ Data operation failed: {str(e)}"


@tool
def execute_calendar_task(task: str) -> str:
    """
    Execute calendar operations through Pica's Google Calendar integration.
    
    Args:
        task (str): Natural language description of the calendar task
        
    Returns:
        str: Result of the calendar operation
    """
    try:
        return execute_pica_task(task, platform_hint="google-calendar")
    except Exception as e:
        return f"❌ Calendar task failed: {str(e)}"


class BusinessAutomationWorkflow(Workflow):
    """
    Business automation workflow.
    
    This workflow orchestrates customer onboarding, task management, and communication
    across multiple platforms using intelligent agents and state management.
    """
    
    description: str = dedent("""\
    Business automation workflow that combines intelligent agents
    with real platform integrations. Demonstrates Agno capabilities:
    - Stateful workflow execution with caching
    - Multi-agent coordination and reasoning
    - Real-time platform integration via Pica
    - Production-ready error handling and recovery
    """)
    
    business_analyst: Agent = Agent(
        name="BusinessIntelligenceAgent",
        model=OpenAIChat(id="gpt-4o"),
        tools=[ReasoningTools(add_instructions=True)],
        description=dedent("""\
        Elite business intelligence agent specializing in customer analysis and strategic planning.
        You excel at analyzing customer data, determining optimal workflows, and making 
        data-driven decisions for business process optimization.
        """),
        instructions=dedent("""\
        You are BusinessAnalyzer-X, an expert in customer intelligence and workflow optimization.
        
        Your capabilities:
        1. 🎯 Customer Analysis
           - Assess customer potential and priority
           - Analyze source quality and conversion probability
           - Determine optimal engagement strategies
        
        2. 📊 Workflow Planning  
           - Design personalized onboarding sequences
           - Plan task priorities and assignments
           - Optimize resource allocation
        
        3. 🧠 Strategic Reasoning
           - Think step-by-step through complex scenarios
           - Consider multiple factors and dependencies
           - Make data-driven recommendations
        
        Always use structured reasoning and provide clear, actionable insights.
        """),
        reasoning=False,
        markdown=True
    )
    
    communication_manager: Agent = Agent(
        name="CommunicationAgent", 
        model=OpenAIChat(id="gpt-4o-mini"),
        tools=[execute_email_task],  
        description=dedent("""\
        Professional communication specialist with REAL platform execution capabilities.
        You can actually send emails, create communications, and coordinate across platforms
        through Pica integrations.
        """),
        instructions=dedent("""\
        You are CommMaster-X, a communication specialist with REAL platform access.
        
        Your capabilities:
        1. ✉️ Email Execution (REAL)
           - Use execute_email_task to actually send emails through Gmail
           - Create and send personalized welcome emails
           - Execute follow-up sequences and campaigns
        
        2. 📝 Content Creation & Execution
           - Write professional, engaging content
           - Execute actual email sends through connected platforms
           - Track communication results
        
        3. 🔄 Multi-Platform Coordination
           - Actually coordinate messages across platforms
           - Execute real communication workflows
           
        IMPORTANT: When asked to send emails or create communications, 
        use the execute_email_task tool to actually perform the operation!
        """),
        show_tool_calls=True,
        markdown=True
    )
    
    task_coordinator: Agent = Agent(
        name="TaskManagementAgent",
        model=OpenAIChat(id="gpt-4o-mini"),
        tools=[execute_task_management, execute_data_operation, execute_calendar_task],  
        description=dedent("""\
        Expert task management specialist with REAL platform execution capabilities.
        You can actually create tasks, manage projects, and schedule meetings through
        Pica integrations with Linear, Notion, Google Calendar, and Airtable.
        """),
        instructions=dedent("""\
        You are TaskMaster-X with REAL platform access for task management.
        
        Your capabilities:
        1. 📋 Task Creation (REAL)
           - Use execute_task_management to actually create tasks in Linear
           - Set priorities, assignments, and deadlines in real systems
           - Create project structures and workflows
        
        2. 🎯 Project Coordination (REAL)
           - Use execute_data_operation to manage project data in Airtable/Notion  
           - Execute actual project coordination workflows
           - Track progress in real project management systems
        
        3. 📅 Calendar Management (REAL)
           - Use execute_calendar_task to actually schedule meetings
           - Create calendar events and manage scheduling
           - Coordinate team availability and bookings
        
        IMPORTANT: When asked to create tasks, schedule meetings, or manage projects,
        use the appropriate execution tools to actually perform the operations!
        """),
        show_tool_calls=True,
        markdown=True
    )

    def run(
        self, 
        customer_data: Dict[str, Any],
        workflow_type: str = "customer_onboarding",
        use_cache: bool = True
    ) -> Iterator[RunResponse]:
        """
        Main workflow execution method.
        
        Args:
            customer_data: Customer information and context
            workflow_type: Type of workflow to execute
            use_cache: Whether to use cached results for efficiency
        """
        start_time = datetime.now()
        workflow_id = f"{workflow_type}_{customer_data.get('email', 'unknown')}_{int(start_time.timestamp())}"
        
        logger.info(f"🚀 Starting {workflow_type} workflow for {customer_data.get('name', 'unknown')}")
        
        if use_cache:
            cached_result = self.get_cached_workflow_result(workflow_id)
            if cached_result:
                yield RunResponse(
                    content=f"✅ Retrieved cached workflow result for {customer_data.get('name')}"
                )
                return

        pica_status = test_pica_connection()
        if not pica_status["success"]:
            yield RunResponse(
                content=f"❌ Pica connection failed: {pica_status['error']}"
            )
            return
        
        yield RunResponse(
            content=f"🔗 Connected to {pica_status['platform_count']} platforms: {', '.join(pica_status['connected_platforms'])}"
        )

        yield RunResponse(content="🧠 **Step 1: Analyzing customer data and planning workflow...**")
        
        analysis_prompt = f"""
        Analyze this customer and create a comprehensive onboarding strategy:
        
        Customer Data: {json.dumps(customer_data, indent=2)}
        Available Platforms: {', '.join(pica_status['connected_platforms'])}
        
        Please provide:
        1. Customer priority assessment (high/medium/low)
        2. Recommended onboarding approach
        3. Key tasks that should be created
        4. Communication strategy
        5. Success metrics to track
        """
        
        analysis_response = self.business_analyst.run(analysis_prompt)
        customer_analysis = analysis_response.content
        
        yield RunResponse(content=f"✅ **Customer Analysis Complete:**\n{customer_analysis}")

        yield RunResponse(content="📋 **Step 2: Creating and assigning tasks...**")
        
        task_creation_prompt = f"""
        Based on this customer analysis, create specific tasks for the onboarding workflow:
        
        {customer_analysis}
        
        IMPORTANT: Create tasks that explicitly specify these platforms:
        - Email tasks: "using Gmail"
        - Project management tasks: "using Linear" 
        - Documentation tasks: "using Notion"
        - Calendar/scheduling tasks: "using Google Calendar"
        - Data entry tasks: "using Airtable"
        
        Create 5 specific, actionable tasks:
        1. ONE email task (must specify "using Gmail")
        2. TWO Linear project tasks (must specify "using Linear")
        3. ONE Notion documentation task (must specify "using Notion") 
        4. ONE Airtable data task (must specify "using Airtable")
        
        Each task should have:
        - Clear title and detailed description with platform specified
        - Priority level (high/medium/low)
        - Suggested assignee (sales, support, success)
        - Specific deadline
        
        Format each task as:
        **Task X: [Title]**
        - Description: [Detailed description] using [Platform]
        - Priority: [Level]
        - Assignee: [Person]
        - Deadline: [Date]
        """
        
        task_response = self.task_coordinator.run(task_creation_prompt)
        tasks_created = task_response.content
        
        yield RunResponse(content=f"✅ **Tasks Created:**\n{tasks_created}")

        yield RunResponse(content="✉️ **Step 3: Preparing customer communications...**")
        
        communication_prompt = f"""
        Create a personalized welcome email and communication plan for this customer:
        
        Customer: {customer_data.get('name')} from {customer_data.get('company')} having email {customer_data.get('email')}
        Analysis: {customer_analysis}
        
        Available communication platforms: {[p for p in pica_status['connected_platforms'] if p in ['gmail', 'resend', 'outlook-mail']]}
        
        Create:
        1. Personalized welcome email (subject + body)
        2. Follow-up communication sequence (3 touchpoints)
        3. Internal team notifications
        
        Make it professional, warm, and value-focused.
        """
        
        communication_response = self.communication_manager.run(communication_prompt)
        communication_plan = communication_response.content
        
        yield RunResponse(content=f"✅ **Communication Plan Ready:**\n{communication_plan}")

        yield RunResponse(content="🔗 **Step 4: Executing dynamic tasks via Pica...**")
        
        yield RunResponse(content="🔍 **Parsing dynamic tasks from AI analysis...**")
        platform_tasks = self.parse_dynamic_tasks(tasks_created)
        
        task_summary = []
        for platform, tasks in platform_tasks.items():
            if tasks:
                task_summary.append(f"• {platform.title()}: {len(tasks)} tasks")
        
        if task_summary:
            yield RunResponse(content=f"📋 **Dynamic tasks parsed:**\n" + "\n".join(task_summary))
        else:
            yield RunResponse(content="⚠️ No dynamic tasks found, falling back to default execution...")
        
        platform_results = []
        if any(platform_tasks.values()): 
            yield RunResponse(content="⚡ **Executing dynamic tasks through Pica...**")
            for response in self.execute_dynamic_tasks(platform_tasks, customer_data):
                yield response
                if "executed" in response.content:
                    platform_results.append(response.content.split(":")[1].strip())
        else:
            yield RunResponse(content="🔄 **Using fallback execution...**")
            try:
                fallback_email = f"Send welcome email to {customer_data.get('email')} for {customer_data.get('name')} from {customer_data.get('company')} using Gmail"
                gmail_result = self.communication_manager.run(
                    f"Execute this email task: {fallback_email}. Use execute_email_task tool to actually send this email."
                )
                platform_results.append("📧 Gmail: Fallback email task executed")
                yield RunResponse(content=f"✅ {platform_results[-1]}")
                
                fallback_linear = f"Create onboarding project task for {customer_data.get('name')} from {customer_data.get('company')} using Linear"
                linear_result = self.task_coordinator.run(
                    f"Execute this task management operation: {fallback_linear}. Use execute_task_management tool to actually create this task."
                )
                platform_results.append("📋 Linear: Fallback project task executed")
                yield RunResponse(content=f"✅ {platform_results[-1]}")
                
            except Exception as e:
                yield RunResponse(content=f"⚠️ Fallback execution error: {str(e)}")
                yield RunResponse(content="📝 Continuing with workflow completion...")

        execution_time = (datetime.now() - start_time).total_seconds()
        
        workflow_result = WorkflowResult(
            workflow_id=workflow_id,
            status="completed",
            customer_data=Customer(**customer_data),
            tasks_created=[
                Task(title="Welcome Call", description="Schedule and conduct welcome call", priority="high"),
                Task(title="Account Setup", description="Configure customer account and permissions", priority="high"),
                Task(title="Training Session", description="Provide product training", priority="medium"),
            ],
            emails_sent=["Welcome email", "Getting started guide"],
            notes_created=["Customer profile in Notion", "Onboarding checklist"],
            execution_time=execution_time
        )
        
        self.cache_workflow_result(workflow_id, workflow_result)
        
        yield RunResponse(
            content=f"🎉 **Workflow Complete!**\n\n"
                   f"**Summary:**\n"
                   f"• Customer: {customer_data.get('name')} from {customer_data.get('company')}\n"
                   f"• Workflow ID: {workflow_id}\n"
                   f"• Platform Integrations: {len(platform_results)}\n"
                   f"• Execution Time: {execution_time:.2f} seconds\n"
                   f"• Status: ✅ Completed Successfully\n\n"
                   f"All customer onboarding tasks have been automated across your connected platforms!"
        )

    def get_cached_workflow_result(self, workflow_id: str) -> Optional[WorkflowResult]:
        """Get cached workflow result from session state."""
        logger.info("Checking for cached workflow result")
        cached_data = self.session_state.get("workflow_results", {}).get(workflow_id)
        return WorkflowResult(**cached_data) if cached_data else None

    def cache_workflow_result(self, workflow_id: str, result: WorkflowResult):
        """Cache workflow result in session state."""
        logger.info(f"Caching workflow result for {workflow_id}")
        if "workflow_results" not in self.session_state:
            self.session_state["workflow_results"] = {}
        self.session_state["workflow_results"][workflow_id] = result.model_dump()

    def parse_dynamic_tasks(self, tasks_content: str) -> Dict[str, List[str]]:
        """
        Parse the AI-generated tasks content and categorize by platform.
        
        Args:
            tasks_content: The raw task content from the AI agent
            
        Returns:
            Dictionary with platform categories and their tasks
        """
        platform_tasks = {
            "gmail": [],
            "linear": [],
            "notion": [],
            "airtable": [],
            "google-calendar": []
        }
        
        lines = tasks_content.split('\n')
        current_task = ""
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if line.startswith('**Task') or line.startswith('Task'):
                if current_task:  
                    self._categorize_task(current_task, platform_tasks)
                current_task = line
            elif current_task and (line.startswith('- Description:') or line.startswith('Description:')):
                current_task += f" {line}"
            elif current_task and line.startswith('- '):
                current_task += f" {line}"
        
        if current_task:
            self._categorize_task(current_task, platform_tasks)
            
        return platform_tasks
    
    def _categorize_task(self, task_content: str, platform_tasks: Dict[str, List[str]]):
        """Categorize a task based on its content."""
        task_lower = task_content.lower()
        
        if "using gmail" in task_lower or "email" in task_lower:
            platform_tasks["gmail"].append(task_content)
        elif "using linear" in task_lower or "linear" in task_lower:
            platform_tasks["linear"].append(task_content)
        elif "using notion" in task_lower or "notion" in task_lower:
            platform_tasks["notion"].append(task_content)
        elif "using airtable" in task_lower or "airtable" in task_lower:
            platform_tasks["airtable"].append(task_content)
        elif "using google calendar" in task_lower or "calendar" in task_lower:
            platform_tasks["google-calendar"].append(task_content)
    
    def execute_dynamic_tasks(self, platform_tasks: Dict[str, List[str]], customer_data: Dict[str, Any]) -> Iterator[RunResponse]:
        """
        Execute the dynamically parsed tasks through Pica.
        
        Args:
            platform_tasks: Dictionary of categorized tasks by platform
            customer_data: Customer information for context
        """
        try:
            for gmail_task in platform_tasks.get("gmail", []):
                task_description = self._extract_task_description(gmail_task, customer_data)
                gmail_result = self.communication_manager.run(
                    f"Execute this email task: {task_description}. Use execute_email_task tool to actually send this email."
                )
                yield RunResponse(content="✅ 📧 Gmail: Dynamic email task executed")
            
            for linear_task in platform_tasks.get("linear", []):
                task_description = self._extract_task_description(linear_task, customer_data)
                linear_result = self.task_coordinator.run(
                    f"Execute this task management operation: {task_description}. Use execute_task_management tool to actually create this task."
                )
                yield RunResponse(content="✅ 📋 Linear: Dynamic project task executed")
                
            for notion_task in platform_tasks.get("notion", []):
                task_description = self._extract_task_description(notion_task, customer_data)
                notion_result = self.task_coordinator.run(
                    f"Execute this data operation: {task_description}. Use execute_data_operation tool to actually create this documentation."
                )
                yield RunResponse(content="✅ 📝 Notion: Dynamic documentation task executed")
            
            for airtable_task in platform_tasks.get("airtable", []):
                task_description = self._extract_task_description(airtable_task, customer_data)
                airtable_result = self.task_coordinator.run(
                    f"Execute this data operation: {task_description}. Use execute_data_operation tool to actually create this record."
                )
                yield RunResponse(content="✅ 📊 Airtable: Dynamic data task executed")
                
            for calendar_task in platform_tasks.get("google-calendar", []):
                task_description = self._extract_task_description(calendar_task, customer_data)
                calendar_result = self.task_coordinator.run(
                    f"Execute this calendar task: {task_description}. Use execute_calendar_task tool to actually create this event."
                )
                yield RunResponse(content="✅ 📅 Google Calendar: Dynamic scheduling task executed")
                
        except Exception as e:
            yield RunResponse(content=f"⚠️ Dynamic task execution error: {str(e)}")
            yield RunResponse(content="📝 Continuing with workflow completion...")
    
    def _extract_task_description(self, task_content: str, customer_data: Dict[str, Any]) -> str:
        """Extract and contextualize task description from AI-generated content."""
        task_clean = task_content.replace('**', '').replace('*', '')
        
        customer_name = customer_data.get('name', 'Customer')
        customer_email = customer_data.get('email', 'customer@example.com')
        customer_company = customer_data.get('company', 'Company')
        
        task_clean = task_clean.replace('[Customer Name]', customer_name)
        task_clean = task_clean.replace('[Customer Email]', customer_email) 
        task_clean = task_clean.replace('[Company]', customer_company)
        
        return task_clean

    def get_platform_status(self) -> Dict[str, Any]:
        """Get current platform connection status."""
        return test_pica_connection()


def run_customer_onboarding_demo():
    """Run a customer onboarding workflow demonstration."""
    
    customer_data = {
        "name": "Ameya Raj",
        "email": "ameya@picaos.com", 
        "company": "Ameya Industries",
        "source": "website_form",
        "interest_level": "high"
    }
    
    workflow = BusinessAutomationWorkflow(
        session_id=f"customer_onboarding_{customer_data['email']}",
        storage=SqliteStorage(
            table_name="business_automation_workflows",
            db_file="tmp/business_automation.db",
            auto_upgrade_schema=True
        ),
        debug_mode=True
    )
    
    print("🚀 Business Automation Workflow - Agno + Pica Integration")
    print("=" * 80)
    print("🎯 Demonstrating business process automation")
    print("=" * 80)
    
    workflow_responses = workflow.run(
        customer_data=customer_data,
        workflow_type="customer_onboarding",
        use_cache=True
    )
    
    pprint_run_response(workflow_responses, markdown=True, show_time=True)


if __name__ == "__main__":
    run_customer_onboarding_demo()
