from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.schema import SystemMessage
from .quickbooks_tools import CreateQuickBooksInvoiceTool

load_dotenv()

# Initialize the QuickBooks tool
quickbooks_tool = CreateQuickBooksInvoiceTool()

# Initialize the LLM
_llm = ChatOpenAI(
    model="gpt-4o-mini",  # Using a more reliable model
    temperature=0.7
)

# Initialize the agent with tools
_agent = initialize_agent(
    tools=[quickbooks_tool],
    llm=_llm,
    agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    handle_parsing_errors=True
)

def run_agent_query(query: str) -> str:
    """Run a query through the agent and return the response."""
    try:
        # Add system context about QuickBooks capabilities
        system_context = """You are a helpful business assistant with access to QuickBooks functionality. 
        
        You can create invoices in QuickBooks using the createQuickBooksInvoice tool. 
        Important constraints:
        - Only create invoices with total amount less than $20,000
        - Required: customer_id, line_items (with item_name, quantity, and unit_price)
        - Optional: customer_name, due_date, currency_code, description
        - Line item amounts are automatically calculated as quantity × unit_price
        
        When asked to create invoices, make sure to validate the total amount and gather all required information before proceeding. Always ask for quantity and unit price for each line item. Items are referenced by their display names."""
        
        response = _agent.run(f"{system_context}\n\nUser Query: {query}")
        return str(response)
    except Exception as e:
        return f"Error processing query: {str(e)}"
