# OpenAI Agents SDK

This repository demonstrates how to integrate the [Pica MCP server](https://github.com/picahq/pica-mcp) with [OpenAI's Agents SDK](https://openai.github.io/openai-agents-python/).

## Setup

1. Make sure you have Node.js and Python installed on your system
2. Install the required Python packages:
   ```bash
   pip install openai-agents pica-ai python-dotenv
   ```
3. Set up your environment variables in a `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key
   PICA_SECRET=your_pica_secret_key
   ```

## How It Works

This integration leverages Model Context Protocol (MCP) to provide tools from Pica to OpenAI's Agents. The main features are:

1. Connects to the Pica MCP server via NPM package
2. Makes Pica's tools available to OpenAI Agents
3. Allows for executing various actions through your Pica connections

## Running the Example

Run the example script:

```bash
python examples/basic_example.py
```

This will:
1. Start a local instance of the Pica MCP server using NPX
2. Connect an OpenAI Agent to the Pica tools
3. Execute a sample query using these tools

## Code Example

```python
from agents import Agent, Runner
from agents.mcp import MCPServerStdio, MCPServerStdioParams, MCPUtil
import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def use_pica_mcp():
    # Get the Pica API secret from environment variables
    pica_secret = os.getenv("PICA_SECRET")
    
    # Create the MCPServerStdio with the npm package
    params = MCPServerStdioParams({
        "command": "npx",
        "args": ["-y", "@picahq/pica-mcp"],
        "env": {"PICA_SECRET": pica_secret}
    })
    
    async with MCPServerStdio(params=params) as server:
        # Get Agent tools from the MCP server
        agent_tools = await MCPUtil.get_function_tools(server)
        
        # Create an agent with MCP tools
        agent = Agent(
            name="Assistant with Pica",
            instructions="You are a helpful assistant with Pica tools.",
            tools=agent_tools
        )
        
        # Run the agent with tools
        result = await Runner.run(agent, "Please list my available connections.")
        print(result.final_output)

# Run the async function
if __name__ == "__main__":
    asyncio.run(use_pica_mcp())
```

## Interactive Chat Example

Run the following command to start the interactive chat example through the CLI:

```bash
python examples/interactive_chat_example.py
```

## Available Tools

The Pica MCP server provides the following tools:

- `list_connections` - List all available active connections in your Pica account
- `get_available_actions` - Get available actions for a specific platform
- `get_action_knowledge` - Get detailed information about a specific action
- `execute_action` - Prepare to execute a specific action (requires confirmation)

## More Information

- [Pica Documentation](https://docs.picaos.com)
- [Pica MCP Server](https://github.com/picahq/pica-mcp)
- [OpenAI Agents SDK](https://openai.com/index/new-tools-for-building-agents/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
