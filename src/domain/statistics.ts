import { queryStatsDict } from 'types/type_alias';

function isUuidv4(input: string): boolean {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(input);
}

export class Statistics {
  private readonly _id: string;
  private readonly _average_time: number;
  private readonly _passed_total: [number, number];
  private readonly _syntax_errors: number;
  private readonly _query_result: queryStatsDict;

  constructor(
    id: string,
    average_time: number,
    passed_total: [number, number],
    syntax_errors: number,
    query_result: queryStatsDict,
  ) {
    if (!isUuidv4(id)) {
      throw new Error('Exercise ID is not a UUID');
    }
    if (average_time < 0) {
      throw new Error('Average time can not be negative');
    }
    // passed_total must not be negative, and leftmost number must be smaller than or equal to right most number.
    const [left, right] = passed_total;
    if (left < 0 || right < 0) {
      throw new Error('Number of passes or total submissions cannot negative');
    }
    if (left > right) {
      throw new Error(
        'Number of passes cannot be greater than number of attempts',
      );
    }
    if (syntax_errors < 0) {
      throw new Error('Number of syntax errors cannot be negative');
    }

    // Query attributes
    for (const key in query_result) {
      const query = query_result[key];

      if (query.passes < 0) {
        throw new Error('There cannot be less than 0 submissions passing');
      }
      if (query.fails < 0) {
        throw new Error('There cannot be less than 0 submissions failing');
      }
      if (query.total < 0) {
        throw new Error('There cannot be less than 0 submissions');
      }
      // The total amount of submissions must be all passes + failures + syntax errors
      if (query.total != query.passes + query.fails) {
        throw new Error(
          'The total must be the sum of the number of passes and fails',
        );
      }
      if (query.pass_percentage < 0) {
        throw new Error('There cannot be less than a 0% pass percentage');
      }
    }

    this._id = id;
    this._average_time = average_time;
    this._passed_total = passed_total;
    this._syntax_errors = syntax_errors;
    this._query_result = query_result;
  }

  get id(): string {
    return this._id;
  }
  get average_time(): number {
    return this._average_time;
  }
  get passed_total(): [number, number] {
    return this._passed_total;
  }
  get syntax_errors(): number {
    return this._syntax_errors;
  }
  get query_results(): queryStatsDict {
    return this._query_result;
  }
}
