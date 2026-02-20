import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpSocketClientService {
  private readonly logger = new Logger(HttpSocketClientService.name);
  private readonly socketServiceUrlLive =
    process.env.MT5_SOCKET_SERVICE_URL_LIVE;
  private readonly socketServiceUrlDemo =
    process.env.MT5_SOCKET_SERVICE_URL_DEMO;

  constructor(private readonly httpService: HttpService) {}

  async emitUserAccounts(
    userId: number,
    demo: boolean = false,
  ): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${
            demo ? this.socketServiceUrlDemo : this.socketServiceUrlLive
          }/api/emit/send_user_accounts`,
          {
            userId,
          },
        ),
      );

      this.logger.log(`✅ Emitted send_user_accounts to user ${userId}`);
      return response.data.success || true;
    } catch (error) {
      this.logger.error(`❌ Failed to emit to user ${userId}:`, error.message);
      return false;
    }
  }
}
