import { Statistics } from '../../domain';
import { ISubmissionAPI } from '../../infrastructure/I_Submission_API';
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

    const submissionsResult = await this.submissions_api.getSubmissions(request.id);

    return {
      statistics: await this.calculateStatistics(request.id),
    };
  }
  public async calculateStatistics(
    id: string,
  ): Promise<Statistics | undefined> {
    throw new Error('Not implemented');

  }
}
// submission consists of id, exercise_id, solution, submission_date, passed_queries, failed_queries, has_syntax_error
