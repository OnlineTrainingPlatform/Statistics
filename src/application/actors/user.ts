import { GetStatisticsUseCase, IGetAStatisticsRequest, IGetAStatisticsResponse } from "../usecases/calculate_exercise_statistics_use_case";
import { IUseCase } from "../usecases/i_use_case";

export class User {
    public async getStatistics(request:IGetAStatisticsRequest): Promise<IGetAStatisticsResponse>{
        return  this.getStatisticsUsecase.do(request);
    }
}
