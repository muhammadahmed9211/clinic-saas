import { ApiProperty } from '@nestjs/swagger';

export class GeneralInsightDto {
  @ApiProperty({ example: 1.1185, description: 'Opening price' })
  open: number;

  @ApiProperty({ example: 1.1209, description: 'Current bid price' })
  bid: number;

  @ApiProperty({ example: 1.121, description: 'Current ask price' })
  ask: number;

  @ApiProperty({ example: 1.1185, description: 'Previous close price' })
  prevClose: number;

  @ApiProperty({
    example: '1.1185 - 1.1266',
    description: "Day's trading range",
  })
  dayRange: string;

  @ApiProperty({
    example: '1.0146 - 1.1574',
    description: '52 week trading range',
  })
  weekRange52: string;

  @ApiProperty({
    example: '3.69%',
    description: '1 year price change percentage',
  })
  yearChange1: string;
}

export class TradersSentimentDto {
  @ApiProperty({ example: 36, description: 'Percentage of sellers' })
  sellersPercent: number;

  @ApiProperty({ example: 64, description: 'Percentage of buyers' })
  buyersPercent: number;
}

export class PivotPointDto {
  @ApiProperty({ example: 'R3', description: 'Pivot level name' })
  level: string;

  @ApiProperty({ example: 1.1238, description: 'Classic pivot value' })
  classic: number;

  @ApiProperty({ example: 1.1229, description: 'Fibonacci pivot value' })
  fibonacci: number;
}

export class InsightResponseDto {
  @ApiProperty({ type: GeneralInsightDto })
  generalInsight: GeneralInsightDto;

  @ApiProperty({ type: TradersSentimentDto })
  tradersSentiment: TradersSentimentDto;

  @ApiProperty({ type: [PivotPointDto] })
  pivotPoints: PivotPointDto[];

  @ApiProperty({
    example: '14/05/2025, 15:45:00',
    description: 'Last update timestamp',
  })
  lastUpdated: string;
}
