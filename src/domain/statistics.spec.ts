import { Statistics } from './statistics';
import { v4 as uuidv4 } from 'uuid';

describe('Constructor', () => {
  it('Throws an error if the id is not a uuidv4', () => {
    // Assert
    expect(
      () =>
        new Statistics('id', 11111111, [1, 2], 0, {
          'A<> first query': {
            passes: 1,
            fails: 1,
            total: 2,
            pass_percentage: 50,
          },
        }),
    ).toThrow(Error);
  }),
    it('Throws an error if average_time is negative', () => {
      // Assert
      expect(
        () =>
          new Statistics(uuidv4(), -11111111, [1, 2], 0, {
            'A<> first query': {
              passes: 1,
              fails: 1,
              total: 2,
              pass_percentage: 50,
            },
          }),
      ).toThrow(Error);
    }),
    it('Throws an error if passed_total is negative', () => {
      // Assert
      expect(
        () =>
          new Statistics(uuidv4(), 11111111, [1, 2], 1, {
            'A<> first query': {
              passes: 20,
              fails: 6,
              total: -27,
              pass_percentage: 50,
            },
          }),
      ).toThrow(Error);
    }),
    it('Throws an error if submitted is less than passed, in passed_total', () => {
      // Assert
      expect(
        () =>
          new Statistics(uuidv4(), 11111111, [100, 1], 0, {
            'A<> first query': {
              passes: 1,
              fails: 1,
              total: 2,
              pass_percentage: 50,
            },
          }),
      ).toThrow(Error);
    }),
    it('Throws an error if passes in query_result is negative', () => {
      // Assert
      expect(
        () =>
          new Statistics(uuidv4(), 11111111, [1, 2], 0, {
            query1: {
              passes: -55,
              fails: 1,
              total: 2,
              pass_percentage: 50,
            },
            query2: {
              passes: 1,
              fails: 1,
              total: 2,
              pass_percentage: 50,
            },
          }),
      ).toThrow(Error);
    }),
    it('Throws an error if fails in query_result is negative', () => {
      // Assert
      expect(
        () =>
          new Statistics(uuidv4(), 11111111, [1, 2], 0, {
            query1: {
              passes: 1,
              fails: -66,
              total: 2,
              pass_percentage: 50,
            },
            query2: {
              passes: 1,
              fails: 1,
              total: 2,
              pass_percentage: 50,
            },
          }),
      ).toThrow(Error);
    }),
    it('Throws an error if syntax_errors in query_result is negative', () => {
      // Assert
      expect(
        () =>
          new Statistics(uuidv4(), 11111111, [1, 2], -10, {
            query1: {
              passes: 1,
              fails: 1,
              total: 2,
              pass_percentage: 50,
            },
            query2: {
              passes: 1,
              fails: 1,
              total: 2,
              pass_percentage: 50,
            },
          }),
      ).toThrow(Error);
    }),
    it('Throws an error if total in query_result is negative', () => {
      // Assert
      expect(
        () =>
          new Statistics(uuidv4(), 11111111, [1, 2], 0, {
            query1: {
              passes: 1,
              fails: 1,
              total: -22,
              pass_percentage: 50,
            },
            query2: {
              passes: 1,
              fails: 1,
              total: 2,
              pass_percentage: 50,
            },
          }),
      ).toThrow(Error);
    }),
    it('Throws an error if pass_percentage in query_result is negative', () => {
      // Assert
      expect(
        () =>
          new Statistics(uuidv4(), 11111111, [1, 2], 0, {
            query1: {
              passes: 1,
              fails: 1,
              total: 2,
              pass_percentage: 50,
            },
            query2: {
              passes: 1,
              fails: 1,
              total: 2,
              pass_percentage: -50,
            },
          }),
      ).toThrow(Error);
    }),
    it('Throws an error if less people have passed a specific query, than have passed everything', () => {
      // Assert
      expect(
        () =>
          new Statistics(uuidv4(), 11111111, [1, 2], 0, {
            query1: {
              passes: 1,
              fails: 1,
              total: 2,
              pass_percentage: 50,
            },
            query2: {
              passes: 100,
              fails: 100,
              total: 1,
              pass_percentage: 50,
            },
          }),
      ).toThrow(Error);
    }),
    it('Throws an error if the total is not a total of all passes, fails and syntax errors', () => {
      // Assert
      expect(
        () =>
          new Statistics(uuidv4(), 11111111, [1, 2], 0, {
            query1: {
              passes: 1,
              fails: 1,
              total: 1,
              pass_percentage: 50,
            },
            query2: {
              passes: 0,
              fails: 1,
              total: 2,
              pass_percentage: 50,
            },
          }),
      ).toThrow(Error);
    });
});
