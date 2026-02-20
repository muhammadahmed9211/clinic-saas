import { Controller, SerializeOptions } from '@nestjs/common';
import { HeartBeatService } from './heart-beat.service';
import { Body, Get, Post, Query, UseGuards } from '@nestjs/common/decorators';
import { CreateHeartBeatDto } from './dtos/create-heartbeat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('Heart Beat')
@Controller({
  path: 'heartbeat',
  version: '1',
})
export class HeartBeatController {
  constructor(private readonly heartbeatService: HeartBeatService) {}

  @Post()
  async heartbeat(@Body() dto: CreateHeartBeatDto): Promise<void> {
    await this.heartbeatService.updateHeartbeat(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('active-users')
  async getActiveUsers(@Query() query: PaginationDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const all = query?.all ?? false;
    return await this.heartbeatService.getActiveUsers({ page, limit, all });
  }
}
