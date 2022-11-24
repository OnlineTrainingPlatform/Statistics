import { ISubmission, ISubmissionApi } from './i_submission_api';
import fetch from 'node-fetch-commonjs';

export class FetchSubmissionsApi implements ISubmissionApi {
  async getSubmissions(exerciseId: string): Promise<ISubmission[]> {
    try {
      const response = await fetch(
        `${process.env.SUBMISSIONS_API_BASE_ROUTE}/api/v1/exercises/${exerciseId}`,
      );

      if (response.status === 404) {
        Promise.resolve('Exercise Id could not be found');
      }

      if (response.status === 500) {
        Promise.reject('Failed retrieving the submissions');
      }

      const body = (await response.json()) as {
        submissions: ISubmission[];
      };

      return Promise.resolve(body.submissions);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
