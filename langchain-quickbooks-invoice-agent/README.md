# Quickbooks Invoice Creation Agent using Pica

A LangChain agent that uses Pica to create invoices in Quickbooks with a guardrail that the invoice amount is less than $20000.

Follow the tutorial [here](https://docs.picaos.com/blog/buildkit/quickbooks-langchain-invoice-agent) to get started.

Demo Video: [here](https://youtu.be/1uev_E1vBk4)

## Quickstart

```bash
# 1) Create & activate venv
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2) Install dependencies
pip install -r requirements.txt

# 3) Configure OpenAI
cp .env.example .env
# Edit .env and set OPENAI_API_KEY, PICA_API_KEY and QUICKBOOKS_CONNECTION_KEY

# 4) Run the backend server
python -m src.backend

# 5) Open your browser
# Visit http://localhost:8000 to use the chat interface
```

## Example Usage

```
Create me an invoice for customer with the id {customer_id}.

The invoice should be for the following items:
- 1 Development Services (12000)
- 1 Training Session (1000)
- 1 Consulting Services (1000)
```

Will fail if the invoice amount is greater than $20000:

```
Create me an invoice for customer with the id {customer_id}.

The invoice should be for the following items:
- 1 Development Services (19000)
- 1 Training Session (1000)
- 1 Consulting Services (1000)
```

## Learn More

- [LangChain Documentation](https://python.langchain.com/docs/get_started/introduction) - Learn about LangChain
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Learn about FastAPI  
- [OpenAI API Documentation](https://platform.openai.com/docs) - Learn about OpenAI's API
- [BuildKit Documentation](https://buildkit.picaos.com/integrations) - Learn about BuildKit
