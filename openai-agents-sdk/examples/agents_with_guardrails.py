import asyncio
import os
from typing import Union
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pica_ai import PicaClient, PicaClientOptions
from agents.mcp import MCPUtil, MCPServerStdio, MCPServerStdioParams
from agents import (
    Agent, 
    GuardrailFunctionOutput, 
    RunContextWrapper, 
    Runner, 
    TResponseInputItem, 
    input_guardrail
)

load_dotenv()

class DeleteOrModifyOutput(BaseModel):
    """Output model for the guardrail that checks for delete/modify operations."""
    is_delete_or_modify: bool = Field(
        ..., 
        description="Whether the user is asking to delete or modify files"
    )
    reasoning: str = Field(
        ..., 
        description="Reasoning behind the decision"
    )
    
    class Config:
        extra = "forbid"


# Define the guardrail agent
guardrail_agent = Agent( 
    name="Guardrail check",
    instructions=(
        "Check if the user is asking to delete or modify (write) anything. "
        "If they are, return the is_delete_or_modify field as true and "
        "the reasoning field as the reason for the deletion or modification"
    ),
    output_type=DeleteOrModifyOutput
)

@input_guardrail
async def write_guardrail(
    ctx: RunContextWrapper[None], 
    agent: Agent, 
    input: Union[str, list[TResponseInputItem]]
) -> GuardrailFunctionOutput:
    """
    Guardrail function that checks if the user is trying to delete or modify files.
    """
    result = await Runner.run(guardrail_agent, input, context=ctx.context)
    
    return GuardrailFunctionOutput(
        output_info=result.final_output, 
        tripwire_triggered=result.final_output.is_delete_or_modify,
    )

async def use_pica_mcp():
    """Main function to set up and run the Pica MCP server."""
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
    
    print("Starting Pica MCP server via npm...")
    
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
            agent_tools = await MCPUtil.get_function_tools(server)

            # Setup the agent with MCP tools
            mcp_agent =  Agent(
                name="Assistant with MCP",
                instructions=system_prompt,
                tools=agent_tools,
                input_guardrails=[write_guardrail],
            )
            
            # Run the agent with a test query that should trigger the guardrail
            mcp_result = await Runner.run(
                mcp_agent, 
                "Update the latest contact's name in my hubspot account to John Doe"
            )
            
            print(mcp_result.final_output)
            
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    asyncio.run(use_pica_mcp())
