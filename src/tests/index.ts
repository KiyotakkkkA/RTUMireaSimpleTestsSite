import type { Quiz } from './RBD';
import { RPD_QUIZ } from './RBD';

export type TestEntry = {
  id: string;
  quiz: Quiz;
};

export const TESTS: TestEntry[] = [
  {
    id: 'rbd',
    quiz: RPD_QUIZ,
  },
];
