// interface FilterResult {
//   filterName: string;
//   data: any[];
//   condition?: string;
// }
interface FilterData {
  ids: number[];
  condition: string;
}

type RoleFilterQueryData = {
  [key: string]: FilterData;
};
