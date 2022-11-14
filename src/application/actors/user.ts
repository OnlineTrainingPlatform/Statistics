import { ISubmissionAPI } from "../../infrastructure/I_Submission_API";
import { GetStatisticsUseCase, IGetAStatisticsRequest, IGetAStatisticsResponse } from "../usecases/calculate_exercise_statistics_use_case";
import { IUseCase } from "../usecases/i_use_case";

export class User {
    private readonly getStatisticsUseCase: IUseCase<IGetAStatisticsRequest,IGetAStatisticsResponse>;
    constructor(submission_api: ISubmissionAPI){
        this.getStatisticsUseCase = new GetStatisticsUseCase(submission_api);
    }
    public async getStatistics(request:IGetAStatisticsRequest): Promise<IGetAStatisticsResponse>{
        return  this.getStatisticsUseCase.do(request);
    }
}
