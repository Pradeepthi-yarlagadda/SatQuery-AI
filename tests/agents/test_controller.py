from backend.app.agent.controller import AgentController

def test_controller_demo():
    result = AgentController().run('What is in this image?')
    assert result['task'] in ['vqa', 'SINGLE_VQA']
    assert 0 <= result['confidence'] <= 1
    assert result['execution_trace']
