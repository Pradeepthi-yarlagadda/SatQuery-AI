from tools.vqa_tool.tool import VQATool
from tools.captioning_tool.tool import CaptioningTool
from tools.grounding_tool.tool import GroundingTool
from tools.change_detection_tool.tool import ChangeDetectionTool
from tools.optical_sar_tool.tool import OpticalSARTool


class AgentModelSelector:
    def __init__(self):
        self._tools = {
            "SINGLE_VQA": VQATool(),
            "SCENE_CAPTIONING": CaptioningTool(),
            "REGION_GROUNDING": GroundingTool(),
            "CHANGE_DETECTION": ChangeDetectionTool(),
            "CHANGE_VQA": ChangeDetectionTool(),
            "CROSS_MODAL_FUSION": OpticalSARTool(),
            # Lowercase and alternate aliases
            "vqa": VQATool(),
            "captioning": CaptioningTool(),
            "grounding": GroundingTool(),
            "change_detection": ChangeDetectionTool(),
            "change_vqa": ChangeDetectionTool(),
            "optical_sar": OpticalSARTool()
        }

    def select(self, task: str):
        normalized = str(task).upper()
        if normalized in self._tools:
            return self._tools[normalized]
        if task in self._tools:
            return self._tools[task]
        return self._tools["SINGLE_VQA"]
