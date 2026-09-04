"""
SatQuery AI - Model Selector
"""

from typing import Dict, Any
from agents.model_selector.registry import AgentToolRegistry

class ModelSelector:
    """Selects and binds specialist tool based on query routing."""

    @staticmethod
    def select_tool(tool_name: str) -> Any:
        tool = AgentToolRegistry.get_tool(tool_name)
        if not tool:
            return AgentToolRegistry.get_tool("vqa_tool")
        return tool
