import { IPaginationOptions } from './types/pagination-options';
import {
  InfinityPaginationResultType,
  InfinityPaginationResultTypeNew,
} from './types/infinity-pagination-result.type';
import { TableColumnOrder } from 'src/table-order/entities/table-order.entity';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
  columns?: TableColumnOrder[],
): InfinityPaginationResultType<T> => {
  return {
    data,
    total: data.length,
    hasNextPage: data.length === options.limit,
    ...(columns ? { columns } : {}),
  };
};

export const infinityPaginationNew = <T>(
  success: boolean,
  error: any,
  data: T[],
  options: IPaginationOptions,
): InfinityPaginationResultTypeNew<T> => {
  return {
    success,
    error,
    data,
    paging: {
      start: (options.page - 1) * options.limit,
      limit: options.limit,
      total: data.length,
      hasMore: data.length === options.limit,
    },
  };
};

export const infinityPaginationClient = <T>(
  data: T[],
  total: number,
  options: IPaginationOptions,
  columns?: TableColumnOrder[],
): InfinityPaginationResultType<T> => {
  return {
    data,
    total,
    hasNextPage: data.length === options.limit,
    ...(columns ? { columns } : {}),
  };
};
