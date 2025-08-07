# Agno + Pica Integration - Business Automation Workflow

This project demonstrates integration of [**Agno**](https://www.agno.com/) with **Pica** for automated business process execution.

## 🚀 **What This Integration Achieves**

- ✅ ** Platform Execution**: Tasks are executed through Pica's platform integrations
- ✅ **Dynamic Task Handling**: Tasks created by Agno agents are dynamically passed to Pica for execution
- ✅ **Proper Tool Integration**: Uses official `pica_langchain` package for reliable connections

## 🏗️ **Architecture Overview**

```
Agno Workflow Engine
       ↓
Business Logic Agents (Analysis, Planning, Communication)
       ↓
Task Generation (Dynamic based on customer data)
       ↓
PicaAgentService (Official pica_langchain integration)
       ↓
Pica Platform Execution (Gmail, Linear, Notion, Airtable, etc.)
```

## 📁 **Project Structure**

```
agentops-example/
├── business_automation_workflow.py  # Main workflow orchestration
├── pica_agent_service.py           # Proper Pica integration service
├── pica_utils.py                   # Legacy (now unused)
├── test_pica_integration.py        # Integration testing
├── requirements.txt                # Dependencies
├── .env                           # Environment variables
└── README.md                      # This file
```

## 🔧 **Key Components**

### **1. PicaAgentService**
- **Purpose**: Proper integration between Agno and Pica using official SDK
- **Technology**: `pica_langchain` with `create_pica_agent`
- **Capabilities**: Real platform task execution, error handling, formatted responses

### **2. Business Automation Workflow**
- **Purpose**: Intelligent customer onboarding orchestration
- **Agents**: 
  - Business Analyst (strategic planning)
  - Communication Manager (email workflows) 
  - Task Coordinator (project management)
- **Features**: Caching, state management, multi-agent coordination

### **3. Dynamic Task Execution**
- **Flow**: Agno creates tasks → PicaAgentService executes → Real platform actions
- **Platforms**: Gmail, Linear, Notion, Airtable, Google Calendar
- **Task Types**: Emails, project tickets, data records, calendar events

## 📋 **Setup Instructions**

### **1. Environment Setup**
```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment variables in .env
PICA_SECRET=your_pica_secret_key
OPENAI_API_KEY=your_openai_api_key
```

### **2. Platform Connections**
- Visit [Pica Dashboard](https://app.picaos.com/connections)
- Connect your desired platforms (Gmail, Linear, Notion, etc.)
- Ensure active connections for task execution

### **3. Testing**
```bash
# Run the full workflow
python business_automation_workflow.py
```

## 🎯 **Example Workflow Execution**

### **Input**: Customer Data
```json
{
  "name": "Ameya Raj",
  "email": "ameya@gmail.com",
  "company": "Ameya Industries",
  "source": "website_form",
  "interest_level": "high"
}
```

### **Automated Actions**:
1. **Customer Analysis**: AI-powered priority assessment and strategy planning
2. **Task Creation**: Dynamic generation of onboarding tasks based on analysis
3. **Communication Planning**: Personalized email sequences and team notifications
4. **Platform Execution**: 
   - 📧 **Gmail**: Welcome emails sent to customer
   - 📋 **Linear**: Onboarding tickets created and assigned
   - 📝 **Notion**: Customer profile pages added
   - 📊 **Airtable**: CRM records updated
   - 📅 **Google Calendar**: Follow-up meetings scheduled


### **Business Value**:
- 🤖 **Automated Customer Onboarding**: End-to-end process automation
- 📈 **Scalable Workflows**: Handle multiple customers simultaneously
- 🎯 **Intelligent Task Planning**: AI-driven task creation and prioritization
- 🔗 **Multi-Platform Integration**: Single workflow spans multiple tools
- 📊 **State Management**: Caching and recovery capabilities

## Documentation

- [Agno Documentation](https://docs.agno.com/)
- [Pica Documentation](https://docs.picaos.com/)
