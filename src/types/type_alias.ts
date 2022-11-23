export type queryStatsDict = {
  [query: string]: {
    passes: number;
    fails: number;
    total: number;
    pass_percentage: number;
  };
};
