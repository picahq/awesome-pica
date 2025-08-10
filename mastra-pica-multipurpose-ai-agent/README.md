# Mastra + Pica AI Agent Platform

This project provides a robust integration of the Mastra agent framework with Pica's universal API connectivity, enabling the creation of intelligent AI assistants capable of interacting with over 100 services through natural language.

## Overview

This platform unifies advanced AI technologies to streamline digital workflows. Instead of manually switching between applications or writing automation scripts, users can interact with an AI assistant that understands intent and executes actions across all connected services.

A key differentiator is the unified authentication system provided by Pica, which allows users to connect once and access multiple services securely. The architecture is designed for both extensibility and simplicity, supporting developers and end-users alike.

## Architecture

The system is structured as a three-layer architecture:

```
┌─────────────────────────────────────────────────────────┐
│                   User Interface                        │
│                 (Mastra Playground)                     │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                    Mastra Framework                     │
│         (Agent Management & Orchestration)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    Agents    │  │    Tools     │  │  Workflows   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  Integration Layer                      │
│  ┌──────────────────────┐  ┌─────────────────────────┐  │
│  │   Pica OneTool SDK   │  │   Vercel AI SDK         │  │
│  │  (100+ Integrations) │  │  (Model Routing)        │  │
│  └──────────────────────┘  └─────────────────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                     AI Models                           │
│            (OpenAI, Anthropic, Google, etc.)            │
└─────────────────────────────────────────────────────────┘
```

## Key Features

- **Universal Service Connectivity:** AI agents interact with over 100 services, including GitHub, Google Workspace, Slack, HubSpot, Salesforce, and more. Pica's unified authentication abstracts away individual API keys and authentication flows.
- **Context-Aware Tool Selection:** Agents intelligently select and chain tools using advanced prompt engineering and the Vercel AI SDK.
- **Persistent Memory:** Agents maintain context across conversations and learn from past interactions to provide personalized assistance.
- **Workflow Orchestration:** Structured workflows enable complex multi-step operations with proper error handling and state management.
- **Natural Language Interface:** Users interact with the system using plain English, eliminating the need for command syntax or complex workflows.
- **Modular and Extensible:** The architecture supports easy addition of new agents, integration of additional services, and model customization.

## Prerequisites

- **Node.js** version 20.0 or higher
- An **OpenAI API key** ([platform.openai.com](https://platform.openai.com))
- A **Pica account** with API access ([app.picaos.com](https://app.picaos.com))
- **Git** for repository management
- A code editor such as **VS Code** (optional)

## Getting Started

### Option 1: Full Repository Clone

```bash
git clone https://github.com/sagacious-satadru/awesome-pica.git
cd awesome-pica/mastra-pica-multipurpose-ai-agent
```

### Option 2: Sparse Checkout (Project Only)

If you only want the Mastra + Pica agent platform without other examples:

```bash
git clone --filter=blob:none --sparse https://github.com/sagacious-satadru/awesome-pica.git
cd awesome-pica
git sparse-checkout set mastra-pica-multipurpose-ai-agent
cd mastra-pica-multipurpose-ai-agent
```

### Install Dependencies

```bash
npm install
```

### Configure Credentials

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and provide your credentials:

```env
OPENAI_API_KEY=sk-...your-openai-key-here...
PICA_SECRET=pica_...your-pica-secret-here...
```

### Connect Services

Visit [app.picaos.com](https://app.picaos.com) and connect the services you wish your AI agents to access. Each connection expands the platform's capabilities.

### Launch the Platform

```bash
npm run dev
```

Access the Mastra playground at [http://localhost:4111](http://localhost:4111).

## Usage

The Mastra playground provides a chat interface for interacting with AI agents and executing workflows.

### Available Agents

- **Project Assistant Agent:** Designed for project management, document handling, general tasks and cross-platform coordination. Features persistent memory to maintain context across sessions.
- **Starter Agent:** A foundational agent demonstrating core Mastra + Pica integration patterns. Includes memory capabilities and workflow execution, serving as a template for building custom agents.
- **Code Review Agent:** Helps developers write better, more maintainable, and more secure code through comprehensive analysis and recommendations.
- **Super Agent:** Provides unrestricted access to all tools and supports complex, autonomous operations.

### Available Workflows

- **Starter Workflow:** Discovers and catalogs all connected Pica integrations, providing an overview of available platforms and capabilities. Serves as a foundation for building more complex workflows.

### Example Interactions

- **Connection Discovery:**
  - "What connections do I have available?"
  - "Run the starter workflow to show me my integrations"
- **Document and Knowledge Management:**
  - "Find all documents related to the Q3 marketing campaign and summarize the key strategies"
  - "Create a comprehensive report combining data from our CRM and the latest Google Analytics"
- **Development Workflow Automation:**
  - "Review all open pull requests, summarize the changes, and create issues for any that lack tests"
- **Communication Orchestration:**
  - "Send a personalized email to each team member with their upcoming tasks from GitHub"
- **Cross-Platform Data Synthesis:**
  - "Find all customer feedback from the last month across email, Slack, and support tickets, then create a summary document"

## Customization

### Adding New Agents

To add a new agent, create a file in `src/mastra/agents/`:

```typescript
// src/mastra/agents/marketing-agent.ts
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { pica, picaTools } from "../tools/pica-tools";

const systemPrompt = await pica.generateSystemPrompt();

// Create memory instance for persistent context
const marketingMemory = new Memory({
  storage: new LibSQLStore({
    url: "file:./mastra-marketing-memory.db",
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:./mastra-marketing-memory.db",
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 15,
    semanticRecall: {
      topK: 3,
      messageRange: 2,
      scope: 'resource',
    },
    workingMemory: {
      enabled: true,
      scope: 'resource',
      template: `# Marketing Context
- **Current Campaigns**: 
- **Target Audiences**: 
- **Brand Guidelines**: 
- **Performance Metrics**: 
`,
    },
    threads: {
      generateTitle: true,
    },
  },
});

export const marketingAgent = new Agent({
  name: 'Marketing Specialist',
  instructions: `
    ${systemPrompt}
    
    You are a marketing specialist focused on campaign management,
    content creation, and analytics. You excel at:
    - Creating compelling marketing content
    - Analyzing campaign performance
    - Managing social media presence
    - Coordinating marketing activities across platforms
    
    Always consider brand voice and target audience in your actions.
  `,
  model: openai('gpt-4o-mini'),
  memory: marketingMemory,
  tools: picaTools
});
```

Register the new agent in `src/mastra/index.ts`.

### Creating Custom Workflows

To create a new workflow, add a file in `src/mastra/workflows/`:

```typescript
// src/mastra/workflows/custom-workflow.ts
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const customStep = createStep({
  id: "custom-step",
  description: "Performs custom business logic",
  inputSchema: z.object({
    input: z.string(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ inputData }) => {
    // Custom logic here
    return {
      result: `Processed: ${inputData.input}`,
    };
  },
});

export const customWorkflow = createWorkflow({
  id: "custom-workflow",
  description: "Custom workflow for specific business needs",
  inputSchema: z.object({
    input: z.string(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
})
  .then(customStep)
  .commit();
```

Register the workflow in `src/mastra/index.ts`.

### Configuring Integrations

To restrict agent access to specific services, modify the Pica initialization in `src/mastra/tools/pica-tools.ts`:

```typescript
// Limit to specific services
const pica = new Pica(process.env.PICA_SECRET!, {
  connectors: ["connection-key-1", "connection-key-2"], // Specific connection IDs from your Pica dashboard
});
```

## Project Structure

```
mastra-pica-multipurpose-ai-agent/
├── src/
│   └── mastra/
│       ├── agents/           # AI agent definitions
│       │   ├── project-assistant-agent.ts
│       │   ├── starter-agent.ts
│       │   ├── code-reviewer-agent.ts
│       │   └── super-agent.ts
│       ├── workflows/        # Workflow definitions
│       │   └── starter-workflow.ts
│       ├── tools/            # Tool integrations
│       │   └── pica-tools.ts
│       └── index.ts          # Main configuration
├── .env.example              # Template for environment variables
├── .env                      # Your local configuration (not in git)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Testing

Test individual components to verify functionality:

```bash
# Test Pica tools integration
npx tsx src/test-pica-tools.ts

# Test starter workflow
npx tsx src/test-simple-workflow.ts

# Test starter agent
npx tsx src/test-simple-workflow.ts agent
```

## Resources

- [Mastra Documentation](https://mastra.ai/en/docs)
- [Pica Dashboard](https://app.picaos.com) and [Pica Documentation](https://docs.picaos.com/get-started/introduction)
