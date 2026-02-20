import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import dayjs from 'dayjs'; 
import { HttpService } from '@nestjs/axios';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ConfigService } from '@nestjs/config';
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class EconomicCalendarService {

  private readonly clientId: string;
  private readonly password: string;
  private readonly authUrl: string;
  private readonly eventsUrl: string;

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
  this.clientId = this.configService.getOrThrow<string>('TRADING_CENTRAL_CLIENT_ID');
  this.password = this.configService.getOrThrow<string>('TRADING_CENTRAL_PASSWORD');
  this.authUrl = this.configService.getOrThrow<string>('TRADING_CENTRAL_AUTH_URL');
  this.eventsUrl = this.configService.getOrThrow<string>('TRADING_CENTRAL_EVENTS_URL');
  }

  private async getAuthToken(userId: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(this.authUrl, {
          clientId: this.clientId,
          password: this.password,
          endUserId: userId,
          admin: false,
        }),
      );
      return response.data.Authorization;
    } catch (error) {
     console.error(`Failed to get auth token: ${error.message}`, error.stack);
      if (error.response) {
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      throw new HttpException('Failed to authenticate with Trading Central', HttpStatus.BAD_GATEWAY);
    }
  }

  private getDateRange(filter: 'yesterday' | 'today' | 'tomorrow' | 'week', userTimeZone: string) {

    const now = dayjs().tz(userTimeZone || 'UTC');
    let start = now;
    let end = now;

    switch (filter) {
      case 'yesterday':
        start = now.subtract(1, 'day').startOf('day');
        end = now.subtract(1, 'day').endOf('day');
        break;
      case 'today':
        start = now.startOf('day');
        end = now.endOf('day');
        break;
      case 'tomorrow':
        start = now.add(1, 'day').startOf('day');
        end = now.add(1, 'day').endOf('day');
        break;
      case 'week':
        start = now.startOf('week');
        end = now.endOf('week');
        break;
    }
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }

  async fetchEvents(filter: 'yesterday' | 'today' | 'tomorrow' | 'week', userId: number, lang:string, userTimeZone: string, size :string ,page: string) {
    const token = await this.getAuthToken(`${userId}`);
    const { start, end } = this.getDateRange(filter, userTimeZone);

    const url = `${this.eventsUrl}?size=${size}&page=${page}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&lang=${lang}&token=${token}`;
    
   console.log(`Fetching events from: ${url}`);

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      console.log(`Events fetched successfully, count=${response.data?.events?.length || 0}`);
      return this.normalizeEvents(response.data , filter);
    } catch (error) {
      console.error(`Failed to fetch economic events: ${error.message}`, error.stack);
      if (error.response) {
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      throw new HttpException('Failed to fetch economic events', HttpStatus.BAD_GATEWAY);
    }
  }

  private normalizeEvents(data: any, filter: 'yesterday' | 'today' | 'tomorrow' | 'week') {
    if (!data || !Array.isArray(data.events)) return [];
    return data.events.map((events) => ({
      filter : filter,
      title: events.eventTitle,
      country: events.regionCode,
      flagUrl:  `https://flagcdn.com/w40/${events.regionCode?.toLowerCase()}.png`,
      impact : this.mapImportance(events.importance),
      time: events.eventTime,
      previous: events.previous,
      forecast: events.forecast,
      actual: events.actual,
      description: events.description,
      lastUpdate : events.lastUpdate,
      eventType :events.eventType,
      eventId : events.eventId,
    }));
  }

  private mapImportance(importance: string): number {
    switch (importance?.toLowerCase()) {
      case 'low':
        return 1;
      case 'medium':
        return 2;
      case 'high':
        return 3;
      default:
        return 0;
    }
  }
}