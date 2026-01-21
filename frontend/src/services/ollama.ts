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

const clampPercent = (n: number): number => {
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
};

const getEnv = () => {
  const baseUrl = (process.env.REACT_APP_OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');
  const model = process.env.REACT_APP_OLLAMA_MODEL || '';
  const token = process.env.REACT_APP_OLLAMA_TOKEN || '';
  return { baseUrl, model, token };
};

export const OllamaService = {
  gradeFullAnswer: async (input: {
    questionText: string;
    correctAnswers: string[];
    userAnswer: string;
  }): Promise<FullAnswerModelEvaluation> => {
    const { baseUrl, model, token } = getEnv();
    if (!model) {
      throw new Error('Ollama model is not configured (REACT_APP_OLLAMA_MODEL)');
    }

    const tools = [
      {
        type: 'function',
        function: {
          name: 'check_answer',
          description: 'Оценивает ответ студента по шкале 0-100 и даёт краткий комментарий.',
          parameters: {
            type: 'object',
            properties: {
              scorePercent: {
                type: 'number',
                description: 'Процент правильности (0-100)',
              },
              comment: {
                type: 'string',
                description: 'Короткий комментарий на русском: что верно/что не так и как улучшить.',
              },
            },
            required: ['scorePercent', 'comment'],
          },
        },
      },
    ];

    const system =
      'Ты строгий, но справедливый проверяющий. ' +
      'Сравни ответ пользователя с допустимыми правильными ответами (correctAnswers) и оцени близость/смысл. ' +
      'Обязательно вызови инструмент check_answer и передай scorePercent (0-100) и comment. ' +
      'Не выдавай никаких других данных кроме вызова инструмента.';

    const payload = {
      model,
      stream: false,
      options: {
        temperature: 0,
      },
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: JSON.stringify(
            {
              questionText: input.questionText,
              correctAnswers: input.correctAnswers,
              userAnswer: input.userAnswer,
            },
            null,
            2
          ),
        },
      ],
      tools,
    };

    const isBrowser = typeof window !== 'undefined';
    const url = isBrowser ? '/ollama/api/chat' : `${baseUrl}/api/chat`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Ollama /api/chat failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
    }

    const data = (await res.json()) as OllamaChatResponse;

    const toolCall = data.message.tool_calls?.find((c) => c.function?.name === 'check_answer');
    if (toolCall) {
      const scorePercent = clampPercent(Number(toolCall.function.arguments?.scorePercent));
      const comment = String(toolCall.function.arguments?.comment ?? '').trim();
      return { scorePercent, comment: comment || 'Без комментария.' };
    }

    const raw = (data.message.content || '').trim();
    try {
      const parsed = JSON.parse(raw);
      const scorePercent = clampPercent(Number(parsed.scorePercent));
      const comment = String(parsed.comment ?? '').trim();
      return { scorePercent, comment: comment || 'Без комментария.' };
    } catch {
      throw new Error('Ollama did not return tool_calls(check_answer) or valid JSON fallback');
    }
  },
};
