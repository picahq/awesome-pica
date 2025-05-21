from agents import Agent, ModelSettings, RunConfig, Runner, RunHooks
from agents.mcp import MCPUtil, MCPServerStdio, MCPServerStdioParams
import asyncio
import os
from dotenv import load_dotenv
from pica_ai import PicaClient, PicaClientOptions

load_dotenv()

async def use_pica_mcp():
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
                mcp_servers=[server]
            )
            
            # Run the agent with tools and the action logger
            mcp_result = await Runner.run(
                starting_agent=mcp_agent, 
                input="What connections do I have in access to?",
                max_turns=20
            )

            print(mcp_result.final_output)
            
    except Exception as e:
        print(f"Error running Pica MCP server: {e}")

if __name__ == "__main__":
    asyncio.run(use_pica_mcp())
