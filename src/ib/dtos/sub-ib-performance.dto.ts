export class SubIbPerformanceDto {
    id: number;
    name: string;
    totalLeads: number;
    totalClients: number;
    netDeposit: number;
    totalVolume: number;
    totalCommission: number;
  }
  
export enum PerformancePeriod {
  TODAY = 'today',
  WEEK = 'thisWeek',
  MONTH = 'thisMonth',
  QUARTER = 'thisQuarter',
  YEAR = 'thisYear',
}
