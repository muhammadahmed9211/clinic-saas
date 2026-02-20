export interface SearchSource {
  userid?: string;
  id?: string;
  salesrepid?: string;
  [key: string]: any;
}
export interface SearchHit<T = any> {
  _index: string;
  _id: string;
  _source: T;
  highlight?: Record<string, string[]>;
}
export interface SearchResponse<T = any> {
  hits: {
    hits: Array<SearchHit<T>>;
    total: {
      value: number;
      relation: string;
    };
  };
  took: number;
}
export interface FormattedHit {
  _source: SearchSource;
  id: string;
  _index: string;
  redirect_link: string;
  highlight?: Record<string, string[]>;
  currentUserId? : any;
}

export interface GlobalSearchResponse {
  hits: FormattedHit[];
  total: SearchResponse['hits']['total'];
  took: number;
}
