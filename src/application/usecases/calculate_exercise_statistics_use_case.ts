import { queryStatsDict } from 'types/type_alias';
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

    const total_submissions = submissions.length;
    const total_syntax_errors = this.countSyntaxErrors(submissions);
    const total_passed = this.totalPassedQueries(submissions);

    // Get all submission dates
    const submission_dates = submissions.map(sub => sub.submission_date);


    const all_queries = this.getAllQueries(submissions);
    const query_dict = new Map<string, [number, number]>();

    all_queries.forEach(q => {
      query_dict.set(q, [0, 0]); // [passed_count, failed_count]
    });

    submissions.forEach((submission) => {
      
      submission.failed_queries.forEach((failed_query) => {
        const temp = query_dict.get(failed_query.query);
        if (temp) {
          query_dict.set(failed_query.query, [temp[0], temp[1] + 1]);
        }
      });

      // passes
      submission.passed_queries.forEach((pass_query) => {
        const temp = query_dict.get(pass_query.query);
        if (temp) {
          query_dict.set(pass_query.query, [temp[0] + 1, temp[1]]);
        }
      });

      //submission_dates.push(submission.submission_date);
    });

    const average_time = submission_dates.reduce((a, b) => a + b, 0) / submission_dates.length;

    const dictionary_keys = Array.from(query_dict.keys());
    const dictionary_values = Array.from(query_dict.values());

    let query_results: queryStatsDict = {};
    dictionary_keys.forEach((key, i) => {
      query_results[key] = {
        passes: dictionary_values[i][0],
        fails: dictionary_values[i][1],
        total: dictionary_values[i][0] + dictionary_values[i][1],
        pass_percentage:
          dictionary_values[i][0] / (dictionary_values[i][0] +
          dictionary_values[i][1]) * 100,
      };
    });

    const statistics = new Statistics(
      submissions[0].exercise_id,
      average_time,
      [total_passed, total_submissions],
      total_syntax_errors,
      query_results,
    );
    return statistics;
  }

  private getAllQueries(submissions: ISubmission[]) {
    // Create array of all queries, passed and failed
    let list_of_all_queries: string[] = [];
    submissions.forEach((sub) => {
      const passed = this.parseQueries(sub.passed_queries);
      list_of_all_queries = list_of_all_queries.concat(passed);
      list_of_all_queries = list_of_all_queries.concat(this.parseQueries(sub.failed_queries));
    });
    return list_of_all_queries;
  }

  private countSyntaxErrors(submissions: ISubmission[]) {
    return submissions.reduce(
      (count, sub) => count + Number(sub.has_syntax_error),
      0
    );
  }

  private totalPassedQueries(submissions: ISubmission[]) {
    return submissions.reduce(
      (count, sub) => !sub.has_syntax_error && Object.keys(sub.failed_queries).length === 0
        ? count + 1
        : count,
      0
    );
  }

  /**
   * Converts the queries as object array to array of strings
   * @param queries queries as object array ie.: [{query_1: 'E<> Proc.F'}, ...]
   * @returns the query from each object ie.: ['E<> Proc.F', ...]
   */
  private parseQueries(queries: object[]) {
    const arr: string[] = [];
    for (const obj of queries) {
      arr.push(Object.values(obj)[0] as string);
    }
    return arr;
  }
}
