// Ikigai Dimensions
export const IkigaiDimension = {
  LOVE: 'love', // What you love
  GOOD_AT: 'good_at', // What you're good at
  WORLD_NEEDS: 'world_needs', // What the world needs
  PAID_FOR: 'paid_for', // What you can be paid for
} as const;

export type IkigaiDimension = typeof IkigaiDimension[keyof typeof IkigaiDimension];

// Question Types
export const QuestionType = {
  SINGLE_CHOICE: 'single_choice',
  MULTIPLE_CHOICE: 'multiple_choice',
  SCALE: 'scale',
  TEXT: 'text',
  RANKING: 'ranking',
} as const;

export type QuestionType = typeof QuestionType[keyof typeof QuestionType];

// Question Interface
export interface Question {
  id: string;
  dimension: IkigaiDimension;
  type: QuestionType;
  question: string;
  description?: string;
  options?: QuestionOption[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  placeholder?: string;
  required?: boolean;
}

// Question Option
export interface QuestionOption {
  id: string;
  text: string;
  value: number; // Weight for scoring
  emoji?: string;
}

// User Response
export interface UserResponse {
  questionId: string;
  dimension: IkigaiDimension;
  value: string | number | string[];
  timestamp: Date;
}

// Reflection Entry
export interface ReflectionEntry {
  dimension: IkigaiDimension;
  content: string;
  timestamp: Date;
}

// Dimension Score
export interface DimensionScore {
  dimension: IkigaiDimension;
  score: number; // 0-100
  insights: string[];
  topAnswers: string[];
}

// Career Recommendation
export interface CareerRecommendation {
  title: string;
  type: 'traditional' | 'entrepreneurial' | 'hybrid';
  description: string;
  matchScore: number;
  alignedDimensions: IkigaiDimension[];
  skills: string[];
  nextSteps: string[];
  resources?: string[];
}

// User Progress
export interface UserProgress {
  currentDimension: IkigaiDimension | null;
  currentQuestionIndex: number;
  completedDimensions: IkigaiDimension[];
  responses: UserResponse[];
  reflections: ReflectionEntry[];
  startedAt: Date;
  lastUpdated: Date;
}

// Results
export interface IkigaiResults {
  dimensionScores: DimensionScore[];
  ikigaiScore: number; // Overall alignment score
  careerRecommendations: CareerRecommendation[];
  summary: string;
  completedAt: Date;
}

// App State
export interface AppState {
  progress: UserProgress | null;
  results: IkigaiResults | null;
  isComplete: boolean;
}
