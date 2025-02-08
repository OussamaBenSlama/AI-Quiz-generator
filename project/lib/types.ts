// export interface Question {
//   question: string;
//   options: string[];
//   answer: string;
//   explanation?: string;
// }

type OptionsType = {
  [key: string]: string;
};

export interface Question {
  id: number;
  text: string;
  correct_response: string;
  explanation: string;
  format: string;
  options: OptionsType;
  response?: string;
}

export interface QuizData {
  questions: Question[];
}

export interface QuizResult {
  id: number;
  text: string;
  user_response: string;
  correct_response: string;
  format: string;
  is_correct: boolean;
  explanation: string;
}

export interface QuizResponse {
  results: QuizResult[];
}
