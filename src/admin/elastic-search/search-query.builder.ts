export class SearchQueryBuilder {
    private query: any;
  
    constructor() {
      this.query = {
        bool: {
          must: [],
          filter: [],
          should: [],
        },
      };
    }
  
    addMultiMatch(text: string, fields: string[]) {
      this.query.bool.must.push({
        multi_match: {
          query: text,
          fields,
          type: 'best_fields',
          operator: 'and',
          fuzziness: 'AUTO',
        },
      });
      return this;
    }
  
    addTermFilter(field: string, value: any) {
      this.query.bool.filter.push({
        term: { [field]: value },
      });
      return this;
    }
  
    addTermsFilter(field: string, values: any[]) {
      this.query.bool.filter.push({
        terms: { [field]: values },
      });
      return this;
    }
  
    addRangeFilter(field: string, range: { gte?: any; lte?: any }) {
      this.query.bool.filter.push({
        range: { [field]: range },
      });
      return this;
    }
  
    addShouldMatch(queries: any[]) {
      this.query.bool.should = [...this.query.bool.should, ...queries];
      return this;
    }
  
    build() {
      return {
        query: this.query,
      };
    }
  }