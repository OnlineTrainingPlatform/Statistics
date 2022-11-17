import { Statistics } from '../../domain';
import {
  ISubmission,
  ISubmissionAPI,
} from '../../infrastructure/I_Submission_API';
import { IUseCase } from './i_use_case';

export interface IGetAStatisticsRequest {
  id: string;
}
export interface IGetAStatisticsResponse {
  statistics: Statistics | undefined;
}

export class GetStatisticsUseCase
  implements IUseCase<IGetAStatisticsRequest, IGetAStatisticsResponse>
{
  private readonly submissions_api: ISubmissionAPI;

  constructor(submissions_api: ISubmissionAPI) {
    this.submissions_api = submissions_api;
  }

  public async do(
    request: IGetAStatisticsRequest,
  ): Promise<IGetAStatisticsResponse> {
    const submissionsResult = await this.submissions_api.getSubmissions(
      request.id,
    );

    return {
      statistics: await this.calculateStatistics(submissionsResult),
    };
  }
  public async calculateStatistics(
    submissions: ISubmission[],
  ): Promise<Statistics | undefined> {
    if (submissions.length === 0) return undefined;

    // Doesn't work from here
    let list_of_all_queries: string[] = [];
    list_of_all_queries = list_of_all_queries.concat(
      Object.values(submissions[0].passed_queries),
    );
    list_of_all_queries = list_of_all_queries.concat(
      Object.values(submissions[0].failed_queries),
    );
    // Until here

    const dictionary = new Map<string, [number, number]>();

    for (const element in list_of_all_queries) {
      dictionary.set(element, [0, 0]);
    }

    const submission_times: number[] = [];
    const total_submissions = submissions.length;
    let total_syntax_errors = 0;

    let total_passed = 0;

    submissions.map((submission) => {
      // if there are no syntax errors and no failed queries, all queries must have passed.
      if (
        !submission.has_syntax_error &&
        Object.keys(submission.failed_queries).length === 0
      ) {
        total_passed += 1;
      }
      if (submission.has_syntax_error) {
        total_syntax_errors += 1;
      }
      // fails
      submission.failed_queries.map((failed_query) => {
        const temp = dictionary.get(failed_query.query);
        if (!temp) return { statistics: undefined };
        dictionary.set(failed_query.query, [temp[0], temp[1] + 1]);
      });

      // passes
      submission.passed_queries.map((pass_query) => {
        const temp = dictionary.get(pass_query.query);
        if (!temp) return { statistics: undefined };
        dictionary.set(pass_query.query, [temp[0] + 1, temp[1]]);
      });

      submission_times.push(submission.submission_date);
    });

    const calculated_average_time =
      submission_times.reduce((a, b) => a + b, 0) / submission_times.length;

    const dictionary_keys = Array.from(dictionary.keys());
    const dictionary_values = Array.from(dictionary.values());

    const query_result: Record<string, object> = {};
    dictionary_keys.map((key, i) => {
      query_result[key] = {
        passes: dictionary_values[i][0],
        fails: dictionary_values[i][1],
        total: dictionary_values[i][0] + dictionary_values[i][1],
        pass_percentage:
          dictionary_values[i][0] / dictionary_values[i][0] +
          dictionary_values[i][1],
      };
    });

    const statistics = new Statistics(
      submissions[0].exercise_id,
      calculated_average_time,
      [total_passed, total_submissions],
      total_syntax_errors,
      query_result,
    );
    return statistics;
  }
}
