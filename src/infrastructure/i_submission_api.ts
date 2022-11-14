export interface ISubmission {
  id: string;
  exercise_id: string;
  solution: string;
  submission_date: number;
  passed_queries: [{ query: string }];
  failed_queries: [{ query: string }];
  has_syntax_error: boolean;
}
export interface ISubmissionAPI {
  getSubmissions(exerciseID: string): Promise<ISubmission[]>;
}
