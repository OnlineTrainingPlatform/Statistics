export interface IUseCase<TRequest, TResponse> {
    do(request: TRequest): Promise<TResponse>;
  }
  