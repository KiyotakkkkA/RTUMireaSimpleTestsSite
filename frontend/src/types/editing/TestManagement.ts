export interface TestCreationPayload {
  title: string;
}

export interface TestCreationResult {
  testId: string;
  error?: string;
  message: string;
}

export type TestQuestionPayload = {
  id?: number;
  title: string;
  type: 'single' | 'multiple' | 'matching' | 'full_answer';
  options?: {
    options?: string[];
    correctOptions?: number[];
    terms?: string[];
    meanings?: string[];
    matches?: string[];
    answers?: string[];
  };
};

export type TestQuestionResponse = {
  id: number;
  title: string;
  type: 'single' | 'multiple' | 'matching' | 'full_answer';
  options?: {
    options?: string[];
    correctOptions?: number[];
    terms?: string[];
    meanings?: string[];
    matches?: string[];
    answers?: string[];
  } | null;
  files?: QuestionFile[];
};

export type QuestionFile = {
  id: number;
  name: string;
  alias: string;
  url: string;
  mime_type?: string | null;
  size?: number | null;
};

export type TestDetails = {
  id: string;
  title: string;
  total_questions: number;
  questions: TestQuestionResponse[];
};

export type TestDetailsResponse = {
  test: TestDetails;
};

export type TestUpdatePayload = {
  title?: string;
  questions: TestQuestionPayload[];
};