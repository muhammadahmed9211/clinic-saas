export class MonthlyRegistrationStatsDto {
  month: string;
  count: number;
}

export class RegistrationStatsResponseDto {
  data: MonthlyRegistrationStatsDto[];
  total: number;
} 