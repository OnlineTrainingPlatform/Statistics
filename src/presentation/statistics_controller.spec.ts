import fastify from 'fastify';
import { mock } from 'jest-mock-extended';
import { v4 as uuidv4 } from 'uuid';
import { IGetAStatisticsResponse } from '../application/usecases/calculate_exercise_statistics_use_case';
import { statisticsController } from './statistics_controller';
import { ISubmissionAPI } from '../infrastructure/i_submission_api';
import { User } from '../application/actors/user';

describe('get: /statistics/:id ', () => {
  const server = fastify();
  const submission_api = mock<ISubmissionAPI>();
  const user = mock<User>();
  server.register(statisticsController, {
    submission_api: submission_api,
  });
  it('If status code is 200 then we successfully get statistics', async () => {
    // // Arrange
    const exerciseId = uuidv4();

    // Act
    const response = await server
      .inject()
      .get(`exercises/${exerciseId}/statistics`);
    const payload = JSON.parse(response.payload);
    // Assert
    expect(response.statusCode).toBe(200);
    expect(typeof payload.average_time).toBe('number');
    expect(typeof payload.passed_total).toBe('[number, number]');
    expect(typeof payload.query_result).toBe('object');
    expect(typeof payload.query_result.passes).toBe('number');
    expect(typeof payload.query_result.fails).toBe('number');
    expect(typeof payload.query_result.syntax_errors).toBe('number');
    expect(typeof payload.query_result.total).toBe('number');
    expect(typeof payload.query_result.pass_percentage).toBe('number');

    //expect(response.)
  });

  it('It should give status code 400 if no id is given', async () => {
    // Arrange

    // Act
    const response = await server.inject('exercises//statistics');
    expect(response.statusCode).toBe(400);
  });

  it('If status code is 404 then ____', async () => {
    // Arrange
    const exerciseId = uuidv4();

    // Mock
    // user.getStatistics.mockImplementation(({ id: exerciseId }) => {
    //   return Promise.reject({});
    // });
    user.getStatistics.mockResolvedValue({
      statistics: {},
    } as IGetAStatisticsResponse);

    // Act
    const response = await server.inject(`exercises/${exerciseId}/statistics`);

    // Assert
    expect(response.statusCode).toBe(404);
  });

  it('If status code is 500 then ____', async () => {
    // Arrange
    const exerciseId = uuidv4();

    // Mock
    user.getStatistics.mockImplementation(() => {
      throw new Error();
    });

    // Act
    const response = await server.inject(`exercises/${exerciseId}/statistics`);

    // Assert
    expect(response.statusCode).toBe(500);
  });

  it('If status code is 500 then ____', async () => {
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
