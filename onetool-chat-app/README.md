# Pica OneTool Demo ✨

![Pica OneTool in Action](demo.gif)

Experience the future of API integration with [Pica OneTool](https://www.npmjs.com/package/@picahq/ai) - a revolutionary platform that connects you to 100+ APIs and tools with a single line of code. Powered by cutting-edge tech including Next.js 14, TypeScript, Tailwind CSS, Vercel AI SDK, and OpenAI, it's the integration solution you've been dreaming of.

## Overview

Pica OneTool redefines API integration by providing a seamless, AI-powered hub that connects with virtually any service you need. Built on the powerful [@picahq/ai](https://www.npmjs.com/package/@picahq/ai) framework and leveraging the [Vercel AI SDK](https://www.npmjs.com/package/ai) with [OpenAI](https://www.npmjs.com/package/@ai-sdk/openai), it features an intuitive chat interface that lets you execute complex operations across multiple platforms with natural language - no API documentation diving required. Whether you're managing e-commerce platforms, CRM systems, or any other digital service, Pica OneTool handles the complexity so you can focus on what matters.

## Features

- 🔌 **Universal Integration**: Connect to 100+ APIs through a single interface
- 🤖 **AI-Powered Assistant**: Natural language interface for executing operations
- 🔄 **CRUD Operations**: Support for all standard operations (Create, Read, Update, Delete)
- 📊 **Real-time Capabilities**: Dynamic fetching of platform capabilities and requirements
- 🎨 **Modern UI**: Beautiful, responsive interface with smooth animations and transitions
- 🔐 **Type-Safe**: Built with TypeScript for robust type checking
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices
- 🔍 **Tool Observability**: Collapsible sidebar for monitoring tool executions and responses


## Core Capabilities

- **Entity Management**
  - List available connections
  - View and manage products
  - Create new items
  - Update existing records
  - Delete records
  - Count entities

- **Platform Integration**
  - Real-time capability checking
  - Required fields validation
  - Platform-specific model mapping
  - Error handling and feedback

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **API Integrations**: Pica
- **State Management**: React Hooks
- **UI Components**: Custom components with Tailwind

## Getting Started

1. **Clone the repository:**
```bash
git clone https://github.com/picahq/onetool-demo.git
cd onetool-demo
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create a `.env` file in the root directory from the `.env.example` file:**
```env
PICA_SECRET_KEY=your_secret_key
OPENAI_API_KEY=your_openai_api_key
```

| Variable | Description | Required |
|----------|-------------|----------|
| `PICA_SECRET_KEY` | Your [Pica API secret key](https://app.picaos.com/settings/api-keys) | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

4. **Run the development server:**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser 🚀**

## Usage

Here are some example commands you can use to get started:

- What connections are available?
- What models are supported for Quickbooks?
- Create a new Shopify product
- What fields are required for Gmail messages?
- What caveats are there for Quickbooks Accounts?
- What actions are supported for Attio contacts?


## Support

For support, please visit [picaos.com](https://picaos.com) or contact our support team.
