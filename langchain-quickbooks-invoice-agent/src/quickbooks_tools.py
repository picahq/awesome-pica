"""
QuickBooks integration tools using Pica.
"""
import os
from typing import Dict, Any, Optional, List
from langchain.tools import BaseTool
from pydantic import BaseModel, Field, validator


class InvoiceLineItem(BaseModel):
    """Represents a line item in a QuickBooks invoice."""
    item_name: str = Field(..., description="Name of the item or service")
    quantity: float = Field(1.0, description="Quantity of the item", gt=0)
    unit_price: float = Field(..., description="Unit price for the item", gt=0)
    amount: Optional[float] = Field(None, description="Total amount (calculated as quantity * unit_price if not provided)")
    description: Optional[str] = Field(None, description="Optional description for the line item")
    
    @validator('amount', always=True)
    def calculate_amount(cls, v, values):
        """Calculate amount if not provided, or validate if provided."""
        quantity = values.get('quantity', 1.0)
        unit_price = values.get('unit_price', 0.0)
        calculated_amount = quantity * unit_price
        
        if v is None:
            return calculated_amount
        else:
            # If amount is provided, check if it matches calculation
            if abs(v - calculated_amount) > 0.01:  # Allow for small rounding differences
                raise ValueError(f"Amount {v} doesn't match quantity ({quantity}) * unit_price ({unit_price}) = {calculated_amount}")
            return v


class CreateQuickBooksInvoiceInput(BaseModel):
    """Input schema for creating a QuickBooks invoice."""
    customer_id: str = Field(..., description="QuickBooks customer ID")
    customer_name: Optional[str] = Field(None, description="Customer name for reference (optional)")
    line_items: List[InvoiceLineItem] = Field(..., description="List of line items for the invoice")
    due_date: Optional[str] = Field(None, description="Due date in YYYY-MM-DD format")
    currency_code: Optional[str] = Field("USD", description="Currency code (e.g., USD)")
    
    @validator('line_items')
    def validate_line_items(cls, v):
        if not v:
            raise ValueError("At least one line item is required")
        
        total_amount = sum(item.amount for item in v)
        if total_amount >= 20000:
            raise ValueError(f"Invoice total amount ${total_amount:.2f} exceeds the maximum allowed amount of $20,000")
        
        return v


class CreateQuickBooksInvoiceTool(BaseTool):
    """
    Tool for creating invoices in QuickBooks via Pica integration.
    Only creates invoices with total amount less than $20,000.
    """
    name: str = "createQuickBooksInvoice"
    description: str = """Create an invoice in QuickBooks for a customer. 
    
    Input should include:
    - customer_id: QuickBooks customer ID (required)
    - line_items: List of line items with item_name, quantity, unit_price, and optional description
      * amount will be calculated as quantity * unit_price automatically
    - customer_name: Customer name for reference (optional)
    - due_date: Optional due date in YYYY-MM-DD format
    - currency_code: Optional currency code (defaults to USD)
    
    The tool will only create invoices with total amount less than $20,000.
    Returns the created invoice details including invoice ID and total amount."""

    def _run(self, 
             customer_id: str,
             line_items: List[Dict[str, Any]],
             customer_name: Optional[str] = None,
             due_date: Optional[str] = None,
             currency_code: str = "USD") -> str:
        """Run the tool synchronously."""
        try:
            # Convert line items to proper format
            validated_line_items = [InvoiceLineItem(**item) for item in line_items]
            
            # Create input model for validation
            invoice_input = CreateQuickBooksInvoiceInput(
                customer_id=customer_id,
                customer_name=customer_name,
                line_items=validated_line_items,
                due_date=due_date,
                currency_code=currency_code
            )
            
            # Validate environment variables
            connection_key = os.getenv('QUICKBOOKS_CONNECTION_KEY')
            if not connection_key:
                return "Error: QUICKBOOKS_CONNECTION_KEY environment variable is required. Please set up your QuickBooks connection."
            
            # Calculate total amount for validation (already done in input model)
            total_amount = sum(item.amount for item in invoice_input.line_items)
            
            # Build QuickBooks API request body
            line_items_body = []
            for item in invoice_input.line_items:
                line_item = {
                    "DetailType": "SalesItemLineDetail",
                    "Amount": item.amount,
                    "SalesItemLineDetail": {
                        "ItemRef": {
                            "name": item.item_name
                        },
                        "Qty": item.quantity,
                        "UnitPrice": item.unit_price
                    }
                }
                
                if item.description:
                    line_item["Description"] = item.description
                
                line_items_body.append(line_item)
            
            # Build the invoice request body
            customer_ref = {"value": invoice_input.customer_id}
            if invoice_input.customer_name:
                customer_ref["name"] = invoice_input.customer_name
            
            invoice_body = {
                "Line": line_items_body,
                "CustomerRef": customer_ref
            }
            
            # Add optional fields
            if invoice_input.due_date:
                invoice_body["DueDate"] = invoice_input.due_date
            
            if invoice_input.currency_code and invoice_input.currency_code != "USD":
                invoice_body["CurrencyRef"] = {
                    "value": invoice_input.currency_code
                }
            
            # Make the API call via Pica (using requests directly for sync)
            import requests
            from urllib.parse import urlencode
            
            pica_api_key = os.getenv('PICA_API_KEY')
            if not pica_api_key:
                return "Error: PICA_API_KEY environment variable is required"
            
            # Build URL
            base_url = 'https://api.picaos.com/v1/passthrough'
            url = f"{base_url}/v3/company/{{realmId}}/invoice"
            
            # Prepare headers
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-pica-secret': pica_api_key,
                'x-pica-connection-key': connection_key,
                'x-pica-action-id': 'conn_mod_def::GD9h8p8qTi8::MiNlet1KSQSe99EphDAh6Q',
            }
            
            # Make the API call
            response = requests.post(url, headers=headers, json=invoice_body)
            
            if not response.ok:
                error_text = response.text or f"{response.status_code} {response.reason}"
                return f"Error creating QuickBooks invoice: {response.status_code} {response.reason} :: {error_text}"
            
            # Parse response
            try:
                result = response.json()
            except ValueError as json_error:
                return f"Error parsing response as JSON: {json_error}"
            
            # Extract invoice details from response
            if "Invoice" in result:
                invoice = result["Invoice"]
                invoice_id = invoice.get("Id", "Unknown")
                doc_number = invoice.get("DocNumber", "Unknown")
                created_total = invoice.get("TotalAmt", total_amount)
                balance = invoice.get("Balance", created_total)
                
                # Build line items summary
                line_items_summary = []
                for item in invoice_input.line_items:
                    line_items_summary.append(
                        f"  • {item.item_name}: {item.quantity} × ${item.unit_price:.2f} = ${item.amount:.2f}"
                    )
                
                customer_display = invoice_input.customer_name or f"ID: {invoice_input.customer_id}"
                
                return f"""QuickBooks invoice created successfully!

Invoice Details:
- Invoice ID: {invoice_id}
- Document Number: {doc_number}
- Customer: {customer_display}
- Total Amount: ${created_total:.2f}
- Balance Due: ${balance:.2f}
- Currency: {invoice_input.currency_code}

Line Items:
{chr(10).join(line_items_summary)}

The invoice has been created in QuickBooks and is ready for processing."""
            
            else:
                return f"Invoice creation completed but response format was unexpected. Response: {result}"
                
        except ValueError as e:
            return f"Validation Error: {str(e)}"
        except Exception as e:
            return f"Error creating QuickBooks invoice: {str(e)}"
    
    async def _arun(self, 
                   customer_id: str,
                   line_items: List[Dict[str, Any]],
                   customer_name: Optional[str] = None,
                   due_date: Optional[str] = None,
                   currency_code: str = "USD") -> str:
        """Run the tool asynchronously."""
        return self._run(customer_id, line_items, customer_name, due_date, currency_code)
    
