from typing import Dict, Any, List
import re


class QueryParser:
    @staticmethod
    def extract_keywords(query: str) -> List[str]:
        words = re.findall(r'\b\w+\b', query.lower())
        stopwords = {"what", "is", "the", "are", "in", "this", "image", "scene", "to", "and", "of", "how", "many"}
        return [w for w in words if w not in stopwords]
