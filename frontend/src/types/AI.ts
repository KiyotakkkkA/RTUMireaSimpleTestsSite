export type OllamaToolCall = {
  function: {
    name: string;
    arguments: any;
  };
};

export type OllamaChatResponse = {
  model: string;
  created_at: string;
  message: {
    role: 'assistant' | 'tool' | 'user' | 'system';
    content: string;
    tool_calls?: OllamaToolCall[];
  };
  done: boolean;
  done_reason?: string;
};

export type FullAnswerModelEvaluation = {
  scorePercent: number;
  comment: string;
};