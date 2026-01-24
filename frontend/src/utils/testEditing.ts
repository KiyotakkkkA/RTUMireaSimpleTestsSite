import type { QuestionDraft, QuestionDraftType } from '../components/organisms/test/QuestionEditEntity';
import type { TestQuestionPayload, TestQuestionResponse } from '../types/editing/TestManagement';

export const createQuestionDraft = (id?: number, type: QuestionDraftType = 'single'): QuestionDraft => ({
  id,
  type,
  question: '',
  media: [],
  existingFiles: [],
  removedFileIds: [],
  options: [''],
  correctOptions: [],
  terms: [''],
  meanings: [''],
  matches: [''],
  answers: [''],
});

const ensureList = <T>(value: T[] | undefined | null, fallback: T[]): T[] => {
  if (!value || value.length === 0) return fallback;
  return value;
};

export const mapApiQuestionToDraft = (question: TestQuestionResponse): QuestionDraft => {
  const options = question.options ?? {};

  const base = createQuestionDraft(question.id, question.type as QuestionDraftType);
  const mapped = {
    ...base,
    question: question.title,
    options: ensureList(options.options, ['']),
    correctOptions: options.correctOptions ?? [],
    terms: ensureList(options.terms, ['']),
    meanings: ensureList(options.meanings, ['']),
    matches: ensureList(options.matches, ['']),
    answers: ensureList(options.answers, ['']),
    existingFiles: (question.files ?? []).map((file) => ({
      id: file.id,
      name: file.name,
      url: file.url,
      mime_type: file.mime_type ?? null,
      size: file.size ?? null,
    })),
    removedFileIds: [],
  };

  if (mapped.type === 'matching' && mapped.matches.length < mapped.meanings.length) {
    mapped.matches = [...mapped.matches, ...Array(mapped.meanings.length - mapped.matches.length).fill('')];
  }

  return mapped;
};

export const mapDraftToPayload = (draft: QuestionDraft): TestQuestionPayload => {
  switch (draft.type) {
    case 'single':
    case 'multiple':
      return {
        id: draft.id,
        title: draft.question,
        type: draft.type,
        options: {
          options: draft.options,
          correctOptions: draft.correctOptions,
        },
      };
    case 'matching':
      return {
        id: draft.id,
        title: draft.question,
        type: draft.type,
        options: {
          terms: draft.terms,
          meanings: draft.meanings,
          matches: draft.matches,
        },
      };
    case 'full_answer':
    default:
      return {
        id: draft.id,
        title: draft.question,
        type: draft.type,
        options: {
          answers: draft.answers,
        },
      };
  }
};
