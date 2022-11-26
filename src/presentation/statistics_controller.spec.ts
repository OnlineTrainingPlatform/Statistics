import fastify from 'fastify';
import { mock } from 'jest-mock-extended';
import { v4 as uuidv4 } from 'uuid';
import { IGetAStatisticsResponse } from '../application/usecases/calculate_exercise_statistics_use_case';
import { statisticsController } from './statistics_controller';
import {
  ISubmissionApi,
  ISubmission,
} from '../infrastructure/i_submission_api';
import { User } from '../application/actors/user';
import { Statistics } from '../domain/statistics';

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

describe('get: /statistics/:id ', () => {
  const server = fastify();
  const submission_api = mock<ISubmissionApi>();
  const user = mock<User>();
  server.register(statisticsController, {
    submission_api: submission_api,
  });

  it('If status code is 200 then we successfully get statistics', async () => {
    // Arrange
    const exerciseId = uuidv4();

    // Mock
    const submission: ISubmission = {
      id: 'submission_id',
      exercise_id: exerciseId,
      solution: 'solution',
      submission_date: 123,
      passed_queries: [{ query: 'A<> first query' }],
      failed_queries: [{ query: 'B<> second query' }],
      has_syntax_error: true,
    };

    submission_api.getSubmissions.mockImplementation((exerciseID: string) => {
      if (exerciseID === submission.exercise_id) {
        return Promise.resolve([submission]);
      }
      return Promise.resolve([]);
    });

    // Act
    const response = await server
      .inject()
      .get(`exercises/${exerciseId}/statistics`);
    const payload = JSON.parse(response.payload);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(typeof payload.average_time).toBe('number');
    expect(typeof payload.passed_total).toBe('object');
    expect(typeof payload.query_result).toBe('object');
    expect(typeof payload.query_result['A<> first query'].passes).toBe(
      'number',
    );
    expect(typeof payload.query_result['A<> first query'].fails).toBe('number');
    expect(typeof payload.query_result['A<> first query'].total).toBe('number');
    expect(typeof payload.query_result['A<> first query'].pass_percentage).toBe(
      'number',
    );
  });

  it('It should give status code 400 if no id is given', async () => {
    // Arrange

    // Act
    const response = await server.inject('exercises//statistics');
    expect(response.statusCode).toBe(400);
  });

  it('Status code is 404, if the statistics for an exercise could not be found', async () => {
    // Arrange
    const exerciseId = uuidv4();

    // Mock
    submission_api.getSubmissions.mockImplementation(() => {
      return Promise.resolve([]);
    });

    // Act
    const response = await server.inject(`exercises/${exerciseId}/statistics`);

    // Assert
    expect(response.statusCode).toBe(404);
  });

  it('If status code is 500 then the getStatistics method throws an error', async () => {
    // Arrange
    const exerciseId = uuidv4();

    // Mock
    user.getStatistics.mockImplementation(() => {
      return Promise.reject({} as IGetAStatisticsResponse);
    });

    // Act
    const response = await server.inject(`exercises/${exerciseId}/statistics`);

    // Assert
    expect(response.statusCode).toBe(500);
  });
});
