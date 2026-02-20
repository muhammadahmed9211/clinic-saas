import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { FilterItem, FilterOperation } from './dto/advance-search.dto';
import { ListViewsFilter } from 'src/list-views-filter/entities/list-views-filter.entity';
import { ListColumnFilter } from 'src/list-filter-columns/entities/list-filter-column.entity';

export type ApplyFilters = ApplyListFilterSortColumnDto['filters']
export class InternalAdvanceFilters {
  private static getDataFormKey(data: any, key: string) {
    const keys = key.split('.');

    let resp = data;

    for (let i = 0; i < keys.length; i++) {
      if (resp && resp.hasOwnProperty(keys[i])) {
        resp = resp[keys[i]];
      } else {
        return undefined;
      }
    }

    return resp;
  }

  private static filterByNumber(data: number, filter: FilterItem) {
    let isFilter = false;
    const { operation } = filter;

    let value = filter.value[0] as number;

    const isEqualOperation =
      operation === FilterOperation.EQUALS ||
      operation === FilterOperation.GREATER_THAN_OR_EQUAL ||
      operation === FilterOperation.LESS_THAN_OR_EQUAL;

    const isGreaterOperation =
      operation === FilterOperation.GREATER_THAN ||
      operation === FilterOperation.GREATER_THAN_OR_EQUAL;

    const isLessOperation =
      operation === FilterOperation.LESS_THAN ||
      operation === FilterOperation.LESS_THAN_OR_EQUAL;
    const isNotEqualOperation = operation === FilterOperation.NOT_EQUAL;

    const isBetween = operation === FilterOperation.BETWEEN;

    const isGreater = data > value;
    const isLess = data < value;
    const isEqual = data === value;
    const isNotEqual = data !== value;

    if (isBetween) {
      const lastValue = filter.value[1];

      if (lastValue && typeof lastValue === 'number') {
        if (data >= value && data <= lastValue) {
          isFilter = true;
        }
      }
    } else if (isEqualOperation && isEqual) {
      isFilter = true;
    } else if (isGreaterOperation && isGreater) {
      isFilter = true;
    } else if (isLessOperation && isLess) {
      isFilter = true;
    } else if (isNotEqualOperation && isNotEqual) {
      isFilter = true;
    }

    return isFilter;
  }

  private static filterByString(data: string, filter: FilterItem) {
    data = data.toLowerCase();
    let isFilter = false;
    const { operation } = filter;

    let value = filter.value[0] as string;
    value = value.toLowerCase();

    const isEqualOperation = operation === FilterOperation.EQUALS;

    const isContainsOperation = operation === FilterOperation.CONTAINS;

    const isStartsWithOperation = operation === FilterOperation.STARTS_WITH;

    const isEndsWithOperation = operation === FilterOperation.ENDS_WITH;

    const isEqual = data === value;
    const isContains = data.includes(value);
    const isStarts = data.startsWith(value);
    const isEnds = data.endsWith(value);

    if (isEqualOperation && isEqual) {
      isFilter = true;
    } else if (isContainsOperation && isContains) {
      isFilter = true;
    } else if (isStartsWithOperation && isStarts) {
      isFilter = true;
    } else if (isEndsWithOperation && isEnds) {
      isFilter = true;
    }

    return isFilter;
  }

  private static isFiltered(data: string | number, filter: FilterItem) {
    if (typeof data === 'string') {
      return this.filterByString(data, filter);
    } else if (typeof data === 'number') {
      return this.filterByNumber(data, filter);
    }
    return false;
  }

  private static applyFilters(data: any[], filters: FilterItem[]): any[] {
    let list: any[] = data;

    for (let index = 0; index < filters.length; index++) {
      const filter = filters[index];
      const key = filter.name;
      const newList = list.filter((d) => {
        const data = this.getDataFormKey(d, key);
        const isFilters = this.isFiltered(data, filter);
        return isFilters;
      });

      list = newList;
    }
    return list;
  }

  static filter(data: any[], filters: FilterItem[]) {
    try {
      return this.applyFilters(data, filters);
    } catch (error) {
      console.error(filters, 'Filter in Advance Filter (Internal Filter)');
      return data;
    }
  }

  static combineFilters(
    viewFilters: ListColumnFilter[],
    applyFilters: ApplyFilters,
    skipFilterName:string[]=[]
  ) {
    const filterKeys = {}
    const filters: FilterItem[] = [];
    if(applyFilters){
      for (let i = 0; i < applyFilters.length; i++) {
        const filterItem = applyFilters[i];
        const value = filterItem.values;
        const operation = filterItem.operator as FilterOperation;
        const name = filterItem.listColumnMeta.name;
        const shouldSkip = skipFilterName.some((n)=>n === name);
        if(shouldSkip){
          continue;
        }
        const filter = {
          value,
          operation,
          name
        }
        if(filterKeys[name]){
          const index = filterKeys[name]
          filters[index] = filter
        }else {
          filterKeys[name] = filters.length;
          filters.push(filter)
        }
      }
    }

    for (let i = 0; i < viewFilters.length; i++) {
      const filterItem = viewFilters[i];
      const value = JSON.parse(filterItem.values);
      const operation = filterItem.operator as FilterOperation;
      const name = filterItem.listColumnMeta.name;
      const shouldSkip = skipFilterName.some((n)=>n === name);
      if(shouldSkip){
        continue;
      };
      const filter = {
        value,
        operation,
        name
      };
      if(filterKeys[name]){
        const index = filterKeys[name]
        filters[index] = filter
      }else {
        filterKeys[name] = filters.length;
        filters.push(filter)
      }
    }

    return filters;
  }
}
