import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { LeadsCallLogsService } from './leads-call-logs.service';
import { CreateLeadsCallLogDto } from './dto/create-leads-call-log.dto';
import { UpdateLeadsCallLogDto } from './dto/update-leads-call-log.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';

// @Controller('leads-call-logs')
@Controller({ path: 'admin/leads', version: '1' })
@ApiTags('Leads Call Logs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@SerializeOptions({
  groups: ['admin'],
})
export class LeadsCallLogsController {
  constructor(private readonly leadsCallLogsService: LeadsCallLogsService) {}

  @Get('call-logs/stats')
  @HttpCode(HttpStatus.OK)
  async getNotesStats(@GetUser() user: User) {
    return await this.leadsCallLogsService.getCallLogsStats(user.id);
  }

  @Post('listAll/call-logs')
  @HttpCode(HttpStatus.OK)
  async getAllPartners(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    return this.leadsCallLogsService.findAll(
      query.limit || 10,
      query.page || 1,
      user.id,
      body,
    );
  }

  @Post(':id/call-logs')
  create(
    @Body() createLeadsCallLogDto: CreateLeadsCallLogDto,
    @Param('id') leadId: string,
    @Req() req: any,
  ) {
    return this.leadsCallLogsService.create(
      createLeadsCallLogDto,
      +leadId,
      +req.user.id,
    );
  }

  @Get(':id/call-logs')
  findAllByLeadId(@Param('id') leadId: string) {
    return this.leadsCallLogsService.findAllByLeadId(+leadId);
  }

  @Get('call-logs/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.leadsCallLogsService.findOne(+id);
  }

  @Patch('call-logs/:id')
  update(
    @Param('id') id: string,
    @Body() updateLeadsCallLogDto: UpdateLeadsCallLogDto,
    @Req() req: any,
  ) {
    return this.leadsCallLogsService.update(
      +id,
      updateLeadsCallLogDto,
      +req.user.id,
    );
  }

  @Delete('call-logs/:id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.leadsCallLogsService.remove(+id, +user.id);
  }
}
