export type InfinityPaginationResultType<T> = Readonly<{
  data: T[];
  total: number;
  hasNextPage: boolean;
}>;

export type InfinityPaginationResultTypeNew<T> = Readonly<{
  success: boolean;
  error: any;
  data: T[];
  paging: {
    start: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}>;
