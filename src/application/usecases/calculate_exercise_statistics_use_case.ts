import { queryStatsDict } from 'types/type_alias';
import { Statistics } from '../../domain';
import { ISubmission, ISubmissionApi } from '../../infrastructure';
import { IUseCase } from './i_use_case';

export interface IGetAStatisticsRequest {
  exercise_id: string;
}
export interface IGetAStatisticsResponse {
  statistics:
    | {
        id: string;
        average_time: number;
        passed_total: {
          passed: number;
          total: number;
        };
        query_result: queryStatsDict;
      }
    | undefined;
}

export class GetStatisticsUseCase
  implements IUseCase<IGetAStatisticsRequest, IGetAStatisticsResponse>
{
  private readonly submissions_api: ISubmissionApi;

  constructor(submissions_api: ISubmissionApi) {
    this.submissions_api = submissions_api;
  }

  public async do(
    request: IGetAStatisticsRequest,
  ): Promise<IGetAStatisticsResponse> {
    const submissionsResult = await this.submissions_api.getSubmissions(
      request.exercise_id,
    );

    const statistics = await this.calculateStatistics(submissionsResult);
    console.log(statistics);
    if (!statistics) {
      return {
        statistics: undefined,
      };
    }

    return {
      statistics: {
        id: request.exercise_id,
        average_time: statistics.average_time,
        passed_total: {
          passed: statistics.passed_total[0],
          total: statistics.passed_total[1],
        },
        query_result: statistics.query_results,
      },
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
    const submission_dates = submissions.map((sub) => sub.submission_date);

    const all_queries = this.getAllQueries(submissions);
    const query_dict = new Map<string, [number, number]>();

    all_queries.forEach((q) => {
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

      submission_dates.push(submission.submission_date);
    });

    console.log(query_dict);
    console.log(submission_dates);

    let average_time = 0;
    if (submission_dates.length > 0) {
      average_time =
        submission_dates.reduce((a, b) => a + b, 0) / submission_dates.length;
    }

    console.log(average_time);

    const dictionary_keys = Array.from(query_dict.keys());
    const dictionary_values = Array.from(query_dict.values());

    const query_results: queryStatsDict = {};
    dictionary_keys.forEach((key, i) => {
      query_results[key] = {
        passes: dictionary_values[i][0],
        fails: dictionary_values[i][1],
        total: dictionary_values[i][0] + dictionary_values[i][1],
        pass_percentage:
          (dictionary_values[i][0] /
            (dictionary_values[i][0] + dictionary_values[i][1])) *
          100,
      };
    });

    console.log(dictionary_keys);
    console.log(dictionary_values);

    const statistics = new Statistics(
      submissions[0].exercise_id,
      average_time,
      [total_passed, total_submissions],
      total_syntax_errors,
      query_results,
    );

    console.log(statistics);

    return statistics;
  }

  private getAllQueries(submissions: ISubmission[]) {
    // Create array of all queries, passed and failed
    let list_of_all_queries: string[] = [];
    submissions.forEach((sub) => {
      const passed = this.parseQueries(sub.passed_queries);
      list_of_all_queries = list_of_all_queries.concat(passed);
      list_of_all_queries = list_of_all_queries.concat(
        this.parseQueries(sub.failed_queries),
      );
    });
    return list_of_all_queries;
  }

  private countSyntaxErrors(submissions: ISubmission[]) {
    return submissions.reduce(
      (count, sub) => count + Number(sub.has_syntax_error),
      0,
    );
  }

  private totalPassedQueries(submissions: ISubmission[]) {
    return submissions.reduce(
      (count, sub) =>
        !sub.has_syntax_error && Object.keys(sub.failed_queries).length === 0
          ? count + 1
          : count,
      0,
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
