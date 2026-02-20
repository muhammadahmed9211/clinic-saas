import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActiveLogService } from './active-log.service';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ActiveLogDTO } from './dto/get-active-log.dto';
import { GetOperatorLogDto, GetUserLogDto } from './dto/get-user-log.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin Active Logs')
@Controller({ path: 'admin', version: '1' })
export class ActiveLogController {
  constructor(private readonly activeLogService: ActiveLogService) {}

  @ApiHeaders([{ name: 'x_custom_lang', schema: { default: 'en' } }])
  @Get('activity-log')
  async getLogs(@Query() entity: ActiveLogDTO): Promise<any> {
    return await this.activeLogService.getLogs(entity);
  }

  @ApiHeaders([{ name: 'x_custom_lang', schema: { default: 'en' } }])
  @Get('user-log')
  async getUserLogs(@Query() entity: GetUserLogDto): Promise<any> {
    return await this.activeLogService.getUserLogs(entity);
  }

  @ApiHeaders([{ name: 'x_custom_lang', schema: { default: 'en' } }])
  @Get('operator-log')
  async getOperatorLogs(@Query() entity: GetOperatorLogDto): Promise<any> {
    return await this.activeLogService.getOperatorLogs(entity);
  }
}
