export class Statistics {
  private readonly _average_time: number;
  private readonly _passed_total: [number, number];
  private readonly _query_result: {
    [query: string]: {
      passes: number;
      fails: number;
      syntax_errors: number;
      total: number;
      pass_percentage: number;
    };
  };

  constructor(
    average_time: number,
    passed_total: [number, number],
    query_result: {
      [query: string]: {
        passes: number;
        fails: number;
        syntax_errors: number;
        total: number;
        pass_percentage: number;
      };
    },
  ) {
    this._average_time = average_time;
    this._passed_total = passed_total;
    this._query_result = query_result;
  }

  get average_time(): number {
    return this.average_time;
  }
  get passed_total(): [number, number] {
    return this._passed_total;
  }
  get query_results(): {
    [query: string]: {
      passes: number;
      fails: number;
      syntax_errors: number;
      total: number;
      pass_percentage: number;
    };
  } {
    return this._query_result;
  }
}
