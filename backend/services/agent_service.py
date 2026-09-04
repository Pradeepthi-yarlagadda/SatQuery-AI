"""
SatQuery AI - Agent Service
"""

from typing import List, Dict, Any
from agents.execution_engine.executor import AgentExecutor
from satquery.core.geo_processor import GeoImage

class AgentService:
    """Service wrapper for executing the SatQuery Agent."""

    _executor = AgentExecutor()

    @classmethod
    def process_query(cls, images: List[GeoImage], query: str) -> Dict[str, Any]:
        return cls._executor.execute(images, query)
