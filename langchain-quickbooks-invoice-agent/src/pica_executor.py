"""
Pica Tool Executor for making API calls to third-party platforms via Pica.
"""
import os
import requests
from typing import Dict, Any, Optional
from urllib.parse import urlencode


def pica_tool_executor(
    path: str,
    action_id: str,
    connection_key: str,
    method: str = 'POST',
    query_params: Optional[Dict[str, Any]] = None,
    body: Optional[Dict[str, Any]] = None,
    content_type: str = 'application/json'
) -> Dict[str, Any]:
    """
    Execute a Pica API call to a third-party platform.
    
    Args:
        path: The API endpoint path (e.g., '/v3/company/{realmId}/invoice')
        action_id: The Pica action ID
        connection_key: The connection key for the platform
        method: HTTP method (default: 'POST')
        query_params: Query parameters to append to the URL
        body: Request body for POST/PUT requests
        content_type: Content type header (default: 'application/json')
    
    Returns:
        Dict containing the response data
        
    Raises:
        Exception: If the API call fails or environment variables are missing
    """
    # Validate environment variables
    pica_api_key = os.getenv('PICA_API_KEY')
    if not pica_api_key:
        raise Exception('PICA_API_KEY environment variable is required')
    
    # Build URL
    base_url = 'https://api.picaos.com/v1/passthrough'
    url = f"{base_url}{path}"
    
    if query_params:
        query_string = urlencode(query_params)
        url += f"?{query_string}"
    
    # Prepare headers
    headers = {
        'Content-Type': content_type,
        'x-pica-secret': pica_api_key,
        'x-pica-connection-key': connection_key,
        'x-pica-action-id': action_id,
    }
    
    # Prepare request options
    request_options = {
        'method': method.upper(),
        'url': url,
        'headers': headers
    }
    
    if body and method.upper() != 'GET':
        request_options['json'] = body
    
    try:
        # Make the API call
        response = requests.request(**request_options)
        
        if not response.ok:
            error_text = response.text or f"{response.status_code} {response.reason}"
            raise Exception(f"Pica API call failed: {response.status_code} {response.reason} :: {error_text}")
        
        # Try to return JSON, fallback to empty dict
        try:
            return response.json()
        except ValueError:
            return {"message": "Success", "status_code": response.status_code}
            
    except requests.RequestException as e:
        raise Exception(f"Request failed: {str(e)}")
