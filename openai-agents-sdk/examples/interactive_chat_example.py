from agents import Agent, ModelSettings, RunConfig, Runner, RunHooks
from agents.mcp import MCPUtil, MCPServerStdio, MCPServerStdioParams
import asyncio
import os
from dotenv import load_dotenv
from pica_ai import PicaClient, PicaClientOptions

load_dotenv()

class ActionLogger(RunHooks):
    """A custom RunHooks implementation that logs all agent actions."""

    async def on_tool_start(self, context, agent, tool):
        print(f"[LOG] Running tool: {tool.name} 🚀")

    async def on_tool_end(self, context, agent, tool, result):
        print(f"[LOG] Tool {tool.name} finished running ✅")

class InteractiveRunner:
    """A helper class to manage interactive chat sessions with an agent."""
    
    def __init__(self, agent, hooks=None, max_turns_per_interaction=20):
        self.agent = agent
        self.hooks = hooks
        self.max_turns_per_interaction = max_turns_per_interaction
        self.chat_history = []
        
    async def start_chat(self, initial_message=None):
        """Start an interactive chat session with the agent."""
        print("\n🤖 Welcome to the interactive chat! Type 'exit' or 'quit' to end the conversation.\n")
        
        if initial_message:
            await self.process_user_message(initial_message)
        
        while True:
            user_input = input("\n👤 You: ")
            
            if user_input.lower() in ['exit', 'quit']:
                print("\n🤖 Goodbye! Chat session ended.")
                break
            
            if user_input.lower() == 'clear':
                print("\n🤖 Clearing chat history...")
                self.chat_history = []
                continue
                
            await self.process_user_message(user_input)
    
    async def process_user_message(self, message):
        """Process a user message and get a response from the agent."""
        self.chat_history.append({"role": "user", "content": message})
        
        try:
            # If we have chat history, create a context-aware message
            if len(self.chat_history) > 1:
                context_message = self._create_context_message(message)
            else:
                context_message = message
                
            result = await Runner.run(
                self.agent,
                context_message,
                max_turns=self.max_turns_per_interaction,
                hooks=self.hooks,
                run_config=RunConfig(
                    model="gpt-4o",
                    model_settings=ModelSettings(max_tokens=4096)
                )
            )
            
            print(f"\n🤖 Assistant: {result.final_output}")
            
            self.chat_history.append({"role": "assistant", "content": result.final_output})
            
        except Exception as e:
            print(f"\n❌ Error processing your message: {str(e)}")
    
    def _create_context_message(self, current_message):
        """Create a context-aware message that includes relevant chat history."""
        # Limit how much history we include to avoid exceeding token limits
        # Include at most the last 10 messages
        relevant_history = self.chat_history[-10:-1] if len(self.chat_history) > 10 else self.chat_history[:-1]
        
        context = "Here's our conversation so far:\n\n"
        
        for msg in relevant_history:
            role = "You" if msg["role"] == "user" else "Assistant"
            context += f"{role}: {msg['content']}\n\n"
            
        context += f"Based on this conversation history, please respond to my new message: {current_message}"
        
        return context

async def interactive_pica_chat():
    """Start an interactive chat session with a Pica-powered agent."""
    pica_secret = os.getenv("PICA_SECRET")

    if not pica_secret:
        raise ValueError("PICA_SECRET environment variable is not set")

    pica = PicaClient(
        secret=pica_secret, 
        options=PicaClientOptions(
            connectors=["*"],
        )
    )

    system_prompt = pica.generate_system_prompt()
    
    print(f"Starting Pica MCP server via npm...")
    
    params = MCPServerStdioParams({
        "command": "npx",
        "args": ["-y", "@picahq/pica-mcp"],
        "env": {"PICA_SECRET": pica_secret}
    })
    
    try:
        async with MCPServerStdio(
            params=params,
            cache_tools_list=True,
            name="Pica MCP Server"
        ) as server:
            server.invalidate_tools_cache()
            agent_tools = await MCPUtil.get_function_tools(server)
            
            # Create an agent with MCP tools
            mcp_agent = Agent(
                name="Assistant with Pica",
                instructions=system_prompt,
                tools=agent_tools,
                model="gpt-4o",
                tool_use_behavior="run_llm_again",
                reset_tool_choice=False,
                mcp_servers=[server]
            )
            
            interactive_runner = InteractiveRunner(
                agent=mcp_agent,
                max_turns_per_interaction=20,
                hooks=ActionLogger()
            )
            
            await interactive_runner.start_chat()
            
    except Exception as e:
        print(f"Error running Pica MCP server: {e}")

if __name__ == "__main__":
    asyncio.run(interactive_pica_chat()) 