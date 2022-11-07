import { Statistics } from "../../domain";
import { IUseCase } from "./i_use_case";

export interface IGetAStatisticsRequest {
    id: string;
}
export interface IGetAStatisticsResponse {
    statistics: Statistics | undefined;
}

export class GetStatisticsUseCase implements IUseCase<IGetAStatisticsRequest, IGetAStatisticsResponse>{
    constructor() {
    }

    public async do(request: IGetAStatisticsRequest): Promise<IGetAStatisticsResponse> {
        return {
            statistics: await this.calculateStatistics(request.id)
        }
    }
}
