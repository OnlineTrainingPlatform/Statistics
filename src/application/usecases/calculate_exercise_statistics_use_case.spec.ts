import { ISubmissionApi, ISubmission } from '../../infrastructure';
import { mock } from 'jest-mock-extended';
import { Statistics } from '../../domain/statistics';
import { GetStatisticsUseCase } from './calculate_exercise_statistics_use_case';
import { v4 as uuidv4 } from 'uuid';

const STATISTICS_OBJECT_ONE_SUBMISSION = new Statistics(
  uuidv4(),
  50,
  [0, 1],
  1,
  {
    'A<> first query': {
      passes: 1,
      fails: 0,
      total: 1,
      pass_percentage: 100,
    },
    'B<> second query': {
      passes: 0,
      fails: 1,
      total: 1,
      pass_percentage: 0,
    },
  },
);

const STATISTICS_OBJECT_MULTIPLE_SUBMISSION = new Statistics(
  uuidv4(),
  50,
  [1, 2],
  1,
  {
    'A<> first query': {
      passes: 2,
      fails: 0,
      total: 2,
      pass_percentage: 100,
    },
    'B<> second query': {
      passes: 1,
      fails: 1,
      total: 2,
      pass_percentage: 50,
    },
  },
);

describe('do', () => {
  it('Should return an object with statistics field as undefined if Submissions response is an empty list ([])', async () => {
    // Arrange
    const expected = undefined;
    const submissions_api = mock<ISubmissionApi>();
    const use_case = new GetStatisticsUseCase(submissions_api);

    // Mock
    submissions_api.getSubmissions.mockImplementation(() => {
      return Promise.resolve([]);
    });

    //Act
    const actualResponseObject = await use_case.do({
      exercise_id: 'ID',
    });
    const actual = actualResponseObject;

    // Assert
    expect(actual.statistics).toBe(expected);
  });
  it('Should return a Statistics object from a single submission', async () => {
    // Arrange
    const expected = STATISTICS_OBJECT_ONE_SUBMISSION;
    const submission: ISubmission = {
      id: 'submission_id',
      exercise_id: expected.id,
      solution: 'solution',
      submission_date: expected.average_time,
      passed_queries: [{ query: 'A<> first query' }],
      failed_queries: [{ query: 'B<> second query' }],
      has_syntax_error: true,
    };
    const submissions_api = mock<ISubmissionApi>();
    const use_case = new GetStatisticsUseCase(submissions_api);

    // Mock
    submissions_api.getSubmissions.mockImplementation((exerciseID: string) => {
      if (exerciseID === submission.id) {
        return Promise.resolve([submission]);
      }
      return Promise.resolve([]);
    });

    // Act
    const actualResponseObject = await use_case.do({
      exercise_id: submission.id,
    });
    const actual = actualResponseObject;
    if (!actual) {
      return;
    }

    // Assert
    const key = Object.keys(actual.statistics!.query_result)[0];
    // expect(actual).toStrictEqual(expected)
    // expect(actual.average_time).toBe(expected.average_time);
    // expect(actual.id).toBe(expected.id);
    // expect(actual.passed_total).toStrictEqual(expected.passed_total);
    // expect(actual.syntax_errors).toBe(expected.syntax_errors);
    // expect(actual.query_results[key].passes).toBe(expected.query_results[key].passes);
    // expect(actual.query_results[key].fails).toBe(expected.query_results[key].fails);
    // expect(actual.query_results[key].total).toBe(expected.query_results[key].total);
    // expect(actual.query_results[key].pass_percentage).toBe(
    //   expected.query_results[key].pass_percentage,
    // );
  });
  it('Should return a Statistics object from multiple submissions', async () => {
    // Arrange
    const expected = STATISTICS_OBJECT_MULTIPLE_SUBMISSION;
    const submissions: ISubmission[] = [
      {
        id: 'submission_1',

        exercise_id: expected.id,
        solution: 'solution',
        submission_date: 60,
        passed_queries: [
          { query: 'A<> first query' },
          { query: 'B<> second query' },
        ],
        failed_queries: [],
        has_syntax_error: false,
      },
      {
        id: 'submission_2',
        exercise_id: expected.id,
        solution: 'solution',
        submission_date: 40,
        passed_queries: [{ query: 'A<> first query' }],
        failed_queries: [{ query: 'B<> second query' }],
        has_syntax_error: true,
      },
    ];

    const submissions_api = mock<ISubmissionApi>();
    const use_case = new GetStatisticsUseCase(submissions_api);

    // Mock
    submissions_api.getSubmissions.mockImplementation(() => {
      return Promise.resolve(submissions);
    });

    // Act
    const actualResponseObject = await use_case.do({
      exercise_id: expected.id,
    });
    const actual = actualResponseObject;
    if (!actual) {
      return;
    }

    // Assert
    expect(actual.statistics).toStrictEqual({
      average_time: expected.average_time,
      id: expected.id,
      passed_total: {
        passed: expected.passed_total[0],
        total: expected.passed_total[1],
      },
      query_result: expected.query_results,
    });
    // const key = Object.keys(actual.query_results)[0];
    // expect(actual.average_time).toBe(expected.average_time);
    // expect(actual.id).toBe(expected.id);
    // expect(actual.passed_total).toStrictEqual(expected.passed_total);
    // expect(actual.syntax_errors).toBe(expected.syntax_errors);
    // expect(actual.query_results[key].passes).toBe(expected.query_results[key].passes);
    // expect(actual.query_results[key].fails).toBe(expected.query_results[key].fails);
    // expect(actual.query_results[key].total).toBe(expected.query_results[key].total);
    // expect(actual.query_results[key].pass_percentage).toBe(
    //   expected.query_results[key].pass_percentage,
    // );
  });
  it('Should ____ if the ids do not match', async () => {
    // Arrange
    const expected = STATISTICS_OBJECT_MULTIPLE_SUBMISSION;

    const submissions: ISubmission[] = [
      {
        id: 'submission_1',
        exercise_id: uuidv4(),
        solution: 'solution',
        submission_date: 60,
        passed_queries: [
          { query: 'A<> first query' },
          { query: 'B<> second query' },
        ],
        failed_queries: [],
        has_syntax_error: false,
      },
      {
        id: 'submission_2',
        exercise_id: expected.id,
        solution: 'solution',
        submission_date: 40,
        passed_queries: [{ query: 'A<> first query' }],
        failed_queries: [{ query: 'B<> second query' }],
        has_syntax_error: true,
      },
    ];
    const submissions_api = mock<ISubmissionApi>();
    const use_case = new GetStatisticsUseCase(submissions_api);

    // Mock
    submissions_api.getSubmissions.mockImplementation(() => {
      return Promise.resolve(submissions);
    });

    // Act
    const actualResponseObject = await use_case.do({
      exercise_id: expected.id,
    });
    const actual = actualResponseObject;

    // Assert
    expect(actual.statistics!.id).toEqual(expected.id);
  });
});
