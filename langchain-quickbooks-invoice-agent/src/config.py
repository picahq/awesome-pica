"""
Configuration and environment validation for the LangChain QuickBooks application.
"""
import os
from typing import Optional


class EnvironmentError(Exception):
    """Raised when environment variables are missing or invalid."""
    pass


def validate_environment() -> None:
    """
    Validate that all required environment variables are set.
    Raises EnvironmentError if any required variables are missing.
    """
    required_vars = ['OPENAI_API_KEY', 'PICA_API_KEY', 'QUICKBOOKS_CONNECTION_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        missing_list = ', '.join(missing_vars)
        raise EnvironmentError(
            f"Missing required environment variables: {missing_list}. "
            f"Please set these variables before running the application."
        )


def get_pica_api_key() -> str:
    """Get the Pica API key from environment variables."""
    api_key = os.getenv('PICA_API_KEY')
    if not api_key:
        raise EnvironmentError("PICA_API_KEY environment variable is required")
    return api_key


def get_quickbooks_connection_key() -> str:
    """Get the QuickBooks connection key from environment variables."""
    connection_key = os.getenv('QUICKBOOKS_CONNECTION_KEY')
    if not connection_key:
        raise EnvironmentError(
            "QUICKBOOKS_CONNECTION_KEY environment variable is required. "
            "Please set up your QuickBooks connection at https://app.picaos.com/connections"
        )
    return connection_key


def get_openai_api_key() -> str:
    """Get the OpenAI API key from environment variables."""
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise EnvironmentError("OPENAI_API_KEY environment variable is required")
    return api_key


def check_environment_health() -> dict:
    """
    Check the health of environment variables and return status.
    
    Returns:
        Dict with status information for each environment variable
    """
    env_status = {
        'OPENAI_API_KEY': bool(os.getenv('OPENAI_API_KEY')),
        'PICA_API_KEY': bool(os.getenv('PICA_API_KEY')),
        'QUICKBOOKS_CONNECTION_KEY': bool(os.getenv('QUICKBOOKS_CONNECTION_KEY')),
    }
    
    all_set = all(env_status.values())
    
    return {
        'environment_valid': all_set,
        'variables': env_status,
        'missing_count': len([k for k, v in env_status.items() if not v]),
        'setup_url': 'https://app.picaos.com/connections' if not env_status['QUICKBOOKS_CONNECTION_KEY'] else None
    }
