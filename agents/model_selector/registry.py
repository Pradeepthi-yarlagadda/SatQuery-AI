from tools.vqa_tool.tool import VQATool
from tools.captioning_tool.tool import CaptioningTool
from tools.grounding_tool.tool import GroundingTool
from tools.change_detection_tool.tool import ChangeDetectionTool
from tools.optical_sar_tool.tool import OpticalSARTool


class ToolRegistry:
    def __init__(self):
        self._tools = {
            "SINGLE_VQA": VQATool(),
            "SCENE_CAPTIONING": CaptioningTool(),
            "REGION_GROUNDING": GroundingTool(),
            "CHANGE_DETECTION": ChangeDetectionTool(),
            "CHANGE_VQA": ChangeDetectionTool(),
            "CROSS_MODAL_FUSION": OpticalSARTool(),
            # Lowercase aliases
            "vqa": VQATool(),
            "captioning": CaptioningTool(),
            "grounding": GroundingTool(),
            "change_detection": ChangeDetectionTool(),
            "change_vqa": ChangeDetectionTool(),
            "optical_sar": OpticalSARTool()
        }

    def get_tool(self, task_name: str):
        if task_name not in self._tools:
            raise ValueError(f"No registered specialist tool for task: {task_name}")
        return self._tools[task_name]

    def list_tools(self):
        return {name: getattr(tool, "name", name) for name, tool in self._tools.items()}


# Backward compatibility alias
AgentToolRegistry = ToolRegistry
