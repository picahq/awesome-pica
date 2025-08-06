# 🤖 Mastra + Pica AI Agent Platform

A powerful, production-ready integration that combines Mastra's agent framework with Pica's universal API connectivity to create intelligent AI assistants capable of interacting with over 100+ services through natural language.

## 🌟 What Makes This Special

This project represents a convergence of cutting-edge AI technologies that transforms how we interact with our digital tools. Rather than juggling between different applications, copying and pasting information, or writing complex automation scripts, you can now simply have a conversation with an AI assistant that understands your intent and takes action across all your connected services.

What sets this implementation apart is its elegance in solving the authentication complexity that typically plagues multi-service integrations. Through Pica's unified authentication system, you connect once and access everywhere. Your AI agents don't just provide information; they become active participants in your workflow, capable of searching documents, creating tasks, sending messages, and orchestrating complex multi-step operations across your entire tool ecosystem.

The architecture is designed for both simplicity and power. Whether you're a developer looking to extend the platform with custom agents or a user who simply wants to automate their daily tasks, this system provides the flexibility and capability to meet your needs.

## 🏗️ Architecture Overview

The system operates on a sophisticated three-layer architecture where each component plays a crucial role in delivering seamless AI-powered automation:

```
┌─────────────────────────────────────────────────────────┐
│                   User Interface                         │
│                 (Mastra Playground)                      │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                    Mastra Framework                      │
│         (Agent Management & Orchestration)               │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Agents    │  │    Tools     │  │  Workflows   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  Integration Layer                       │
│                                                          │
│  ┌──────────────────────┐  ┌─────────────────────────┐ │
│  │   Pica OneTool SDK   │  │   Vercel AI SDK         │ │
│  │  (100+ Integrations) │  │  (Model Routing)        │ │
│  └──────────────────────┘  └─────────────────────────┘ │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                     AI Models                            │
│            (OpenAI, Anthropic, Google, etc.)             │
└─────────────────────────────────────────────────────────┘
```

## ✨ Key Features

This platform transforms theoretical AI capabilities into practical, actionable intelligence through several groundbreaking features:

**Universal Service Connectivity** enables your AI agents to interact with over 100 services including GitHub, Google Workspace, Slack, HubSpot, Salesforce, and many more. The revolutionary aspect here is that you never touch API keys or authentication flows - Pica's unified authentication layer handles all the complexity behind a single connection point.

**Intelligent Context-Aware Tool Selection** means your AI doesn't randomly try different tools. Through sophisticated prompt engineering and the Vercel AI SDK's advanced tool-calling capabilities, the agents understand not just what tools are available, but when and how to use them effectively. They can even chain multiple tools together to accomplish complex tasks.

**Natural Language as the Universal Interface** removes the barrier between human intent and digital action. You don't need to learn command syntax, API documentation, or complex workflows. Simply describe what you want in plain English, and the AI translates your intentions into precise, coordinated actions across multiple services.

**Modular and Extensible Architecture** ensures that this platform grows with your needs. The clean separation of concerns means you can easily add new agents for specialized tasks, integrate additional services through Pica's ever-growing connector library, or swap AI models to take advantage of the latest advances in artificial intelligence.

## 📋 Prerequisites

Before you can harness the power of this AI agent platform, you'll need to ensure you have the following foundations in place:

- **Node.js** version 20.0 or higher (this is essential for running the TypeScript-based framework)
- An **OpenAI API key** for powering the AI model (obtainable from [platform.openai.com](https://platform.openai.com))
- A **Pica account** with API access (sign up at [app.picaos.com](https://app.picaos.com) - this is what enables the multi-service connectivity)
- **Git** for cloning the repository
- A code editor like **VS Code** for customization (optional but recommended)

## 🚀 Getting Started

Let's walk through the process of getting this powerful AI agent platform running on your local machine. Each step builds upon the previous one, and I'll explain what's happening at each stage so you understand not just the how, but the why.

### Step 1: Clone the Repository

First, bring the project to your local machine. This command creates a complete copy of the project with all its sophisticated agent configurations and tool integrations already in place:

```bash
git clone https://github.com/sagacious-satadru/mastra-pica-multipurpose-ai-agent
cd mastra-pica-multipurpose-ai-agent
```

### Step 2: Install Dependencies

Next, install all the necessary packages that power the platform. This includes the Mastra framework, Pica's integration SDK, the Vercel AI SDK, and all their dependencies:

```bash
npm install
```

This step downloads and configures everything needed to run the AI agents, connect to external services, and power the intelligent decision-making capabilities.

### Step 3: Configure Your Credentials

Now comes the crucial step of providing your personal credentials. Create a `.env` file in the project root directory:

```bash
cp .env.example .env
```

Open the `.env` file in your editor and add your credentials:

```env
# OpenAI Configuration
# Get your key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...your-openai-key-here...

# Pica Integration Platform
# Get your secret from: https://app.picaos.com/settings/api-keys
PICA_SECRET=pica_...your-pica-secret-here...
```

These credentials are the keys to the kingdom - the OpenAI key powers the AI's intelligence, while the Pica secret enables access to all your connected services.

### Step 4: Connect Your Services

This is where your AI agents gain their superpowers. Visit [app.picaos.com](https://app.picaos.com) and navigate to the integrations section. Here, you'll connect the services you want your AI to access. Each connection you make expands your agents' capabilities:

- **GitHub**: Enables repository management, issue creation, and code operations
- **Google Drive**: Allows document search, creation, and management
- **Slack**: Facilitates team communication and channel management
- **Gmail**: Powers email automation and inbox management
- **And 100+ more services** waiting to be connected

The beauty of this system is that you authenticate once with each service through Pica's secure OAuth flow, and then your AI agents can access them all without any additional configuration.

### Step 5: Launch the Platform

With everything configured, start the development server:

```bash
npm run dev
```

The terminal will display:
```
🚀 Mastra playground running at http://localhost:3000
```

Open your browser and navigate to that URL to access the Mastra playground interface where you can interact with your AI agents.

## 🎮 Using the Platform

Once the platform is running, you enter a new paradigm of productivity where natural language becomes your universal remote control for all your digital tools. The Mastra playground provides an intuitive chat interface where you can converse with your AI agents.

### Available Agents

The platform comes pre-configured with two powerful agents, each designed for different use cases:

**Project Assistant Agent** serves as your intelligent digital assistant, equipped with comprehensive access to all your connected tools. This agent excels at project management tasks, document handling, and cross-platform coordination. It understands context and can maintain state across multiple interactions, making it ideal for complex, multi-step operations.

**Super Agent** represents the full potential of the platform, with unrestricted access to all available tools and the ability to chain complex operations autonomously. This agent is perfect when you need maximum capability and are comfortable giving the AI broader decision-making authority.

### Example Interactions

Here are some powerful ways to leverage your AI agents. Notice how these natural language commands translate into sophisticated multi-service operations:

#### Document and Knowledge Management
```
"Find all documents related to the Q3 marketing campaign and summarize the key strategies"
"Create a comprehensive report combining data from our CRM and the latest Google Analytics"
```

#### Development Workflow Automation
```
"Review all open pull requests, summarize the changes, and create issues for any that lack tests"
"Set up a new repository with our standard structure and create initial documentation"
```

#### Communication Orchestration
```
"Send a personalized email to each team member with their upcoming tasks from GitHub"
"Post a weekly summary to Slack combining project updates from GitHub and calendar events"
```

#### Cross-Platform Data Synthesis
```
"Find all customer feedback from the last month across email, Slack, and support tickets, then create a summary document"
"Identify all action items from today's meeting notes and create corresponding tasks in our project management system"
```

## 🛠️ Customization

The platform is designed to be extended and customized to meet your specific needs. Let me walk you through the key customization points that allow you to tailor the system to your workflow.

### Adding New Agents

Creating specialized agents allows you to build AI assistants with specific expertise and personalities. To add a new agent, create a file in `src/mastra/agents/`:

```typescript
// src/mastra/agents/marketing-agent.ts
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { pica, picaTools } from "../tools/pica-tools";

const systemPrompt = await pica.generateSystemPrompt();

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
  tools: picaTools
});
```

Then register your new agent in `src/mastra/index.ts` to make it available in the playground.

### Configuring Specific Integrations

If you want to limit which services an agent can access, modify the Pica initialization in `src/mastra/tools/pica-tools.ts`:

```typescript
// Limit to specific services
const pica = new Pica(process.env.PICA_SECRET!, {
  connectors: ["github", "google-drive", "slack"], // Only these services
});
```

### Switching AI Models

The platform uses the Vercel AI SDK, making it simple to switch between different AI providers. You can easily swap models based on your needs for intelligence, speed, or cost:

```typescript
// Use Claude for better reasoning
import { anthropic } from "@ai-sdk/anthropic";
model: anthropic('claude-3-opus-20240229')

// Use Google's Gemini for multimodal capabilities
import { google } from "@ai-sdk/google";
model: google('gemini-pro')
```

## 📁 Project Structure

Understanding the project organization helps you navigate and extend the codebase effectively:

```
mastra-pica-agent-platform/
├── src/
│   └── mastra/
│       ├── agents/           # AI agent definitions
│       │   ├── project-assistant-agent.ts
│       │   └── super-agent.ts
│       ├── tools/            # Tool integrations
│       │   └── pica-tools.ts
│       └── index.ts          # Main configuration
├── .env.example              # Template for environment variables
├── .env                      # Your local configuration (not in git)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## 🚀 Deployment

When you're ready to move beyond local development and share your AI agents with others, the platform supports multiple deployment options:

```bash
# Deploy to Vercel (recommended for Next.js integration)
npm run build
vercel deploy

# Deploy to Cloudflare Workers
npm run build
wrangler deploy

# Or integrate with an existing application
# See the Mastra documentation for framework-specific guides
```

## 🐛 Troubleshooting

When challenges arise, these solutions address the most common issues you might encounter:

**Agent not responding or tool execution failures** often indicate that the required service isn't connected in your Pica dashboard. Visit app.picaos.com and ensure you've authenticated with the services your agent is trying to access.

**"Invalid API key" or authentication errors** suggest that your environment variables aren't properly configured. Double-check that both your OPENAI_API_KEY and PICA_SECRET are correctly set in your .env file and that the file is in the project root.

**Unexpected AI behavior or responses** might indicate that the model needs better instructions. You can refine agent behavior by adjusting the instructions in the agent definition files. Remember that more specific instructions generally lead to better results.

**Performance issues or slow responses** can occur with complex operations. Consider using a faster model like gpt-4o-mini for routine tasks, reserving more powerful models for complex reasoning tasks.

## 📚 Resources

To deepen your understanding and expand your capabilities with this platform, explore these valuable resources:

- [Mastra Documentation](https://mastra.ai/en/docs) - Comprehensive guides on building agents, tools, and workflows
- [Pica Dashboard](https://app.picaos.com) and [Pica Documentation](https://docs.picaos.com/get-started/introduction) - Manage your integrations and explore available connectors
- [Vercel AI SDK Documentation](https://sdk.vercel.ai) - Learn about model routing and advanced AI features
- [Project Issues](https://github.com/sagacious-satadru/mastra-pica-multipurpose-ai-agent/issues) - Report bugs or request features

## 🤝 Contributing

This project thrives on community contributions. Whether you're adding new agent templates, improving documentation, or fixing bugs, your input makes the platform better for everyone. Feel free to open issues for questions or suggestions, and submit pull requests with improvements.

## 📄 License

MIT License - You're free to use, modify, and distribute this project for both personal and commercial purposes.

---

*Built with ❤️ using [Mastra](https://mastra.ai), [Pica](https://picaos.com), and the [Vercel AI SDK](https://sdk.vercel.ai), by [Satadru Bhowmik](https://github.com/sagacious-satadru/).*