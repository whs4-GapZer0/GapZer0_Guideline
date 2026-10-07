// Replace this boundary with an authenticated runtime API in a future implementation.
// No credentials, network LLM calls, or generic search are implemented here.
export class DemoAdapter {
  async initialize() {
    const response = await fetch('./demo-data.json');
    if (!response.ok) throw new Error('Demo 자료를 읽을 수 없습니다.');
    this.data = await response.json();
  }
  examples() { return this.data.scenarios; }
  async ask({mode, question}) {
    const normalized = question.trim().replace(/\s+/g, ' ');
    if (!normalized) throw new Error('질문을 입력해주세요.');
    if (normalized.length > 2000) throw new Error('질문은 2,000자 이내로 입력해주세요.');
    const scenario = this.data.scenarios.find(s => s.mode === mode && s.question === normalized);
    if (!scenario) throw new Error('Demo에서는 선택한 기능의 예시 질문만 지원합니다. 예시 버튼을 눌러주세요.');
    return {...scenario, demo:true};
  }
}
