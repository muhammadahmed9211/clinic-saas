import { Injectable } from '@nestjs/common';
import {
  InsightResponseDto,
  PivotPointDto,
  TradersSentimentDto,
} from './dtos/insights.dto';

@Injectable()
export class InsightsService {
  getEurUsdInsights(): InsightResponseDto {
    return {
      generalInsight: {
        open: 1.1185,
        bid: 1.1209,
        ask: 1.121,
        prevClose: 1.1185,
        dayRange: '1.1185 - 1.1266',
        weekRange52: '1.0146 - 1.1574',
        yearChange1: '3.69%',
      },
      tradersSentiment: {
        sellersPercent: 36,
        buyersPercent: 64,
      },
      pivotPoints: [
        { level: 'R3', classic: 1.1238, fibonacci: 1.1229 },
        { level: 'R2', classic: 1.1229, fibonacci: 1.1223 },
        { level: 'R1', classic: 1.1221, fibonacci: 1.1218 },
        { level: 'S1', classic: 1.1204, fibonacci: 1.1204 },
        { level: 'S2', classic: 1.1195, fibonacci: 1.1201 },
        { level: 'S3', classic: 1.1187, fibonacci: 1.1195 },
      ],
      lastUpdated: '14/05/2025, 15:45:00',
    };
  }

  getCurrencyPairInsights(pair: string): InsightResponseDto {
    const mockData = {
      EURUSD: {
        generalInsight: [
          { key: 'open', value: '1.1185', label: 'Open Price' },
          { key: 'bid', value: '1.1209', label: 'Bid' },
          { key: 'ask', value: '1.121', label: 'Ask' },
          { key: 'prevClose', value: '1.1185', label: 'Previous Close' },
          { key: 'dayRange', value: '1.1185 - 1.1266', label: 'Day Range' },
          {
            key: 'weekRange52',
            value: '1.0146 - 1.1574',
            label: '52 Week Range',
          },
          { key: 'yearChange1', value: '3.69%', label: '1 Year Change' },
        ],
        tradersSentiment: {
          sellersPercent: 36,
          buyersPercent: 64,
        },
        pivotPoints: [
          { level: 'R3', classic: 1.1238, fibonacci: 1.1229 },
          { level: 'R2', classic: 1.1229, fibonacci: 1.1223 },
          { level: 'R1', classic: 1.1221, fibonacci: 1.1218 },
          { level: 'S1', classic: 1.1204, fibonacci: 1.1204 },
          { level: 'S2', classic: 1.1195, fibonacci: 1.1201 },
          { level: 'S3', classic: 1.1187, fibonacci: 1.1195 },
        ],
        lastUpdated: '14/05/2025, 15:45:00',
      },
      GBPUSD: {
        generalInsight: [
          { key: 'open', value: '1.275', label: 'Open Price' },
          { key: 'bid', value: '1.2765', label: 'Bid' },
          { key: 'ask', value: '1.2767', label: 'Ask' },
          { key: 'prevClose', value: '1.275', label: 'Previous Close' },
          { key: 'dayRange', value: '1.2745 - 1.2785', label: 'Day Range' },
          {
            key: 'weekRange52',
            value: '1.2010 - 1.3150',
            label: '52 Week Range',
          },
          { key: 'yearChange1', value: '2.45%', label: '1 Year Change' },
        ],
        tradersSentiment: {
          sellersPercent: 42,
          buyersPercent: 58,
        },
        pivotPoints: [
          { level: 'R3', classic: 1.2825, fibonacci: 1.2815 },
          { level: 'R2', classic: 1.281, fibonacci: 1.2805 },
          { level: 'R1', classic: 1.2795, fibonacci: 1.279 },
          { level: 'S1', classic: 1.2735, fibonacci: 1.2735 },
          { level: 'S2', classic: 1.272, fibonacci: 1.2725 },
          { level: 'S3', classic: 1.2705, fibonacci: 1.271 },
        ],
        lastUpdated: '14/05/2025, 15:45:00',
      },
      USDJPY: {
        generalInsight: [
          { key: 'open', value: '149.85', label: 'Open Price' },
          { key: 'bid', value: '149.92', label: 'Bid' },
          { key: 'ask', value: '149.95', label: 'Ask' },
          { key: 'prevClose', value: '149.85', label: 'Previous Close' },
          { key: 'dayRange', value: '149.65 - 150.25', label: 'Day Range' },
          {
            key: 'weekRange52',
            value: '140.25 - 152.00',
            label: '52 Week Range',
          },
          { key: 'yearChange1', value: '8.23%', label: '1 Year Change' },
        ],
        tradersSentiment: {
          sellersPercent: 55,
          buyersPercent: 45,
        },
        pivotPoints: [
          { level: 'R3', classic: 150.45, fibonacci: 150.35 },
          { level: 'R2', classic: 150.25, fibonacci: 150.2 },
          { level: 'R1', classic: 150.05, fibonacci: 150.0 },
          { level: 'S1', classic: 149.65, fibonacci: 149.65 },
          { level: 'S2', classic: 149.45, fibonacci: 149.5 },
          { level: 'S3', classic: 149.25, fibonacci: 149.3 },
        ],
        lastUpdated: '14/05/2025, 15:45:00',
      },
    };

    return mockData[pair.toUpperCase()] || mockData['EURUSD'];
  }

  getTradersSentiment(pair: string): TradersSentimentDto {
    const insights = this.getCurrencyPairInsights(pair);
    return insights.tradersSentiment;
  }

  getPivotPoints(pair: string): PivotPointDto[] {
    const insights = this.getCurrencyPairInsights(pair);
    return insights.pivotPoints;
  }

  transformGeneralInsight = (insight: Record<string, string | number>) => {
    console.log('Transforming general insight:', insight);
    return Object.entries(insight).map(([key, value]) => ({
      key,
      value,
      label: this.getLabelForKey(key),
    }));
  };

  private getLabelForKey(key: string): string {
    const labelMap: Record<string, string> = {
      open: 'Open Price',
      bid: 'Bid',
      ask: 'Ask',
      prevClose: 'Previous Close',
      dayRange: 'Day Range',
      weekRange52: '52 Week Range',
      yearChange1: '1 Year Change',
    };
    return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }
}
