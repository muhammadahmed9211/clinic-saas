import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import {
  PaginationDto,
  PaginationDtoForIBCommissionClientWiseReport,
  PaginationDtoForSubIbReport,
} from 'src/database/base-repository/dto/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { ConvertTimezone } from 'src/common/decorators/timezone.decorator';

@ApiTags('Reports')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('retention-volume-targets/list')
  @HttpCode(HttpStatus.OK)
  findAllRetention(
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDto,
  ) {
    return this.reportsService.getRetentionList(user, body, query);
  }

  @Post('mt5-account-summary/list')
  @HttpCode(HttpStatus.OK)
  findAllMt5Accounts(
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDto,
  ) {
    return this.reportsService.getMt5AccountsList(user, body, query);
  }

  @Post('clients-volume-targets/list')
  @HttpCode(HttpStatus.OK)
  findAllClients(
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDto,
  ) {
    return this.reportsService.getClientList(user, body, query);
  }

  @Post('operator/performance')
  @HttpCode(HttpStatus.OK)
  getOperatorReport(
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDto,
  ) {
    return this.reportsService.opeteratorReport(user, body, query);
  }

  @Get('sales-team/dashboard')
  @HttpCode(HttpStatus.OK)
  getSalesTeamDashboard(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    return this.reportsService.getSalesDashboard(query, timeZone, user);
  }

  @Post('sub-ib-breakdown')
  @HttpCode(HttpStatus.OK)
  getSubIbLevelReport(
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDtoForSubIbReport,
  ) {
    return this.reportsService.getSubIbLevelReport(user, body, query);
  }

  @Post('ib-commission')
  @HttpCode(HttpStatus.OK)
  getIbCommission(
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDtoForIBCommissionClientWiseReport,
  ) {
    return this.reportsService.getIbCommissionReport(user, body, query);
  }

  @Post('ib-commission/level-2/:partnerId')
  @HttpCode(HttpStatus.OK)
  getIbCommissionLevel2(
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDtoForIBCommissionClientWiseReport,
    @Param('partnerId') partnerId: string,
  ) {
    return this.reportsService.getIbCommissionReport(user, body, {
      ...query,
      partnerId,
    });
  }

  @Post('ib-commission/level-3/:mt5Login')
  @HttpCode(HttpStatus.OK)
  getIbCommissionLevel3(
    @GetUser() user: User,
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDtoForIBCommissionClientWiseReport,
    @Param('mt5Login') mt5Login: string,
  ) {
    return this.reportsService.getIbCommissionReport(user, body, {
      ...query,
      mt5Login,
    });
  }
}
