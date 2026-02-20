import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeaders, ApiTags, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { LeadsService } from '../leads/leads.service';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { ClientsService } from 'src/users/clients.service';
import { ApplicantService } from '../applicant/applicant.service';
import { TaskService } from '../task/task.service';
import { QueryInactiveClientDto } from 'src/users/dto/query-client.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { ConvertTimezone } from 'src/common/decorators/timezone.decorator';
import { TransactionWidgetsService } from 'src/transaction/services/transaction-widgets/transaction-widgets.service';
import { WidgetType } from 'src/database/base-repository/base-repository';
import { OperatorProductivitySummaryQueryDto } from './dto/dashboard.dto';

@Controller({ path: 'admin/dashboard', version: '1' })
@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly leadsService: LeadsService,
    private readonly clientsService: ClientsService,
    private readonly applicantService: ApplicantService,
    private readonly taskService: TaskService,
    private readonly transactionWidgetsService: TransactionWidgetsService,
  ) { }

  @Get('lead-count')
  async getleadCount(@GetUser() user: User) {
    try {
      const filters: any = await this.leadsService.getLeadsListForDashboard({
        userId: user.id,
      });

      const data = await this.dashboardService.getLeadCounts(filters);
      return {
        message: 'Data fetched succesfully',
        statusCode: 200,
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('latest-leads')
  async getLatestLeads(@GetUser() user: User) {
    const userId = user.id;
    const filter = {
      listColumnMeta: {
        name: 'isActive',
      },
      operator: FilterOperation.EQUALS,
      values: [true],
    };
    const data = await this.leadsService.getLeadsList({
      userId,
      limit: 10,
      page: 1,
      dto: {
        //@ts-expect-error typeerror
        filters: [filter],
      },
    });

    const mappedResult = data.result.map((item) => ({
      id: item?.id,
      typeOfBusiness: item?.typeOfBusiness,
      type: item?.type,
      country: item?.country,
      countryIso: item?.countryIso,
      leadSource: item?.leadSource,
      leadStatusId: item?.leadStatus?.id,
      leadStatusName: item?.leadStatus?.name,
      statusName: item?.salesStatus?.name,
      statusId: item?.salesStatus?.id,
    }));
    return {
      message: 'Data fetched succesfully',
      statusCode: 200,
      data: mappedResult,
    };
  }

  @Get('latest-clients')
  async getLatesClients(@GetUser() user: User) {
    const userId = user.id;
    const filter = {};
    const data = await this.clientsService.findManyWithPagination({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
      userId,
      dto: {
        //@ts-expect-error typeerror
        filters: [filter],
      },
    });

    const mappedResult = data.result.map((item) => ({
      id: item?.userId,
      firstName: item?.firstName,
      lastName: item?.lastName,
      type: item?.type,
      kycStatusId: item?.kycStatus,
      kycStatusName: item?.customKycStatus?.name,
    }));
    return {
      message: 'Data fetched succesfully',
      statusCode: 200,
      data: mappedResult,
    };
  }

  @Get('latest-applicants')
  async getLatesApplicants(@GetUser() user: User) {
    const userId = user.id;
    const filter = {};
    const data = await this.applicantService.findManyWithPagination({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
      userId,
      dto: {
        //@ts-expect-error typeerror
        filters: [filter],
      },
    });

    const mappedResult = data.result.map((item) => ({
      id: item?.userId,
      firstName: item?.firstName,
      lastName: item?.lastName,
      type: item?.type,
      source: item?.source,
      phoneNumber: `+${item?.telephonePrefix}${item?.telephone}`,
      kycStatusId: item?.kycStatus,
      kycStatusName: item?.customKycStatus?.name,
    }));
    return {
      message: 'Data fetched succesfully',
      statusCode: 200,
      data: mappedResult,
    };
  }

  @Get('latest-task')
  async getLatesTask(@GetUser() user: User) {
    const filter = {};
    const data = await this.taskService.findByUser(
      user,
      {
        //@ts-expect-error typeerror
        filters: [filter],
      },
      { limit: 10, page: 1 },
    );
    const mappedResult = data.result.map((item) => ({
      ...item,
      id: item?.id,
      status: item?.status,
      dueDate: item?.dueDate,
      taskOwnerId: item?.assignTo?.id,
      taskOwnerFirstName: item?.assignTo?.firstName,
      taskOwnerLastName: item?.assignTo?.lastName,
      contactId: item?.contact?.id,
      contactFirstName: item?.contact?.firstName,
      contactLastName: item?.contact?.lastName,
    }));
    return {
      message: 'Data fetched succesfully',
      statusCode: 200,
      data: mappedResult,
    };
  }

  @Get('top-opportunities')
  async getTopOpportunities(@GetUser() user: User): Promise<any> {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.dashboardService.getTopOpportunities(filters);

    return {
      message: 'Data fetched succesfully',
      statusCode: 200,
      data: data,
    };
  }

  @Get('graph-data')
  async getGraphData(@GetUser() user: User) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.dashboardService.getOpportunityGraphData(filters);
    return data;
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('call-counts')
  async getCallCounts(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
    @Request() req: any,
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const userTimeZone = req.headers.user_time_zone;
    const counts = await this.dashboardService.getCallCounts(
      filters,
      timeZone,
      userTimeZone,
    );
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data: counts,
    };
  }

  @Get('latest-notes')
  async getLatestNotes(@GetUser() user: User) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const notes = await this.dashboardService.getLatestNotes(filters);
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data: notes,
    };
  }

  @Get('latest-communications')
  async getLatestCommunication(@GetUser() user: User) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const counts = await this.clientsService.getLatestCommunications(filters);

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data: counts,
    };
  }

  // @Get('deposit-withdrawals')
  // async getDepositWithdrawsl(@GetUser() user: User) {
  //   const filters: any = await this.leadsService.getLeadsListForDashboard({
  //     userId: user.id,
  //   });
  //   const [depositsFTD, depositsRepeat, depositsWithdrawals] =
  //     await Promise.all([
  //       this.dashboardService.getDepositsFTD(filters),
  //       this.dashboardService.getDepositsRepeat(filters),
  //       this.dashboardService.getDepositsWithdrawals(filters),
  //     ]);
  //   const depositsNet = {
  //     today:
  //       depositsFTD.today + depositsRepeat.today - depositsWithdrawals.today,
  //     thisWeek:
  //       depositsFTD.thisWeek +
  //       depositsRepeat.thisWeek -
  //       depositsWithdrawals.thisWeek,
  //     thisMonth:
  //       depositsFTD.thisMonth +
  //       depositsRepeat.thisMonth -
  //       depositsWithdrawals.thisMonth,
  //     thisYear:
  //       depositsFTD.thisYear +
  //       depositsRepeat.thisYear -
  //       depositsWithdrawals.thisYear,
  //   };
  //   return {
  //     message: 'Data fetched successfully',
  //     statusCode: 200,
  //     data: { depositsFTD, depositsRepeat, depositsWithdrawals, depositsNet },
  //   };
  // }

  // code for deposit-withdrawals by Arshad shaheen and fatima
  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('deposit-withdrawals')
  async getDepositWithdrawsl2(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const depositsWithdrawalsValues =
      await this.dashboardService.getDepositsWithdrawalValueForOperator(filters, timeZone);

    const depositsNet = {
      today:
        depositsWithdrawalsValues[0].today +
        depositsWithdrawalsValues[1].today -
        depositsWithdrawalsValues[2].today,
      thisWeek:
        depositsWithdrawalsValues[0].thisWeek +
        depositsWithdrawalsValues[1].thisWeek -
        depositsWithdrawalsValues[2].thisWeek,
      thisMonth:
        depositsWithdrawalsValues[0].thisMonth +
        depositsWithdrawalsValues[1].thisMonth -
        depositsWithdrawalsValues[2].thisMonth,
    };

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data: {
        depositsFTD: depositsWithdrawalsValues[0],
        depositsRepeat: depositsWithdrawalsValues[1],
        depositsWithdrawals: depositsWithdrawalsValues[2],
        depositsNet,
      },
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('sales-deposit-withdrawal')
  async getSalesDepositWithdrawal(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters = await this.leadsService.getFiltersForDashboard({ userId: user.id, }, WidgetType.SALES_REP);
    const filters2: any = await this.leadsService.getLeadsListForDashboard({ userId: user.id });
    const depositsWithdrawalsValues =
      await this.dashboardService.getDepositsWithdrawalValueForOperator({ ...filters, operatorFilter: filters2.operatorFilter }, timeZone);

    const depositsNet = {
      today:
        depositsWithdrawalsValues[0].today +
        depositsWithdrawalsValues[1].today -
        depositsWithdrawalsValues[2].today,
      thisWeek:
        depositsWithdrawalsValues[0].thisWeek +
        depositsWithdrawalsValues[1].thisWeek -
        depositsWithdrawalsValues[2].thisWeek,
      thisMonth:
        depositsWithdrawalsValues[0].thisMonth +
        depositsWithdrawalsValues[1].thisMonth -
        depositsWithdrawalsValues[2].thisMonth,
    };

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data: {
        depositsFTD: depositsWithdrawalsValues[0],
        depositsRepeat: depositsWithdrawalsValues[1],
        depositsWithdrawals: depositsWithdrawalsValues[2],
        depositsNet,
      },
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('sales-cockpit-deposit-withdrawal')
  async getSalesCockpitDepositWithdrawal(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters = await this.leadsService.getFiltersForDashboard({ userId: user.id, }, WidgetType.SALES_REP);
    const filters2: any = await this.leadsService.getLeadsListForDashboard({ userId: user.id });

    const depositsWithdrawalsValues =
      await this.dashboardService.getDepositsWithdrawalValueForOperator({ ...filters, operatorFilter: filters2.operatorFilter }, timeZone);

    const depositsNet = {
      today:
        depositsWithdrawalsValues[0].today +
        depositsWithdrawalsValues[1].today -
        depositsWithdrawalsValues[2].today,
      thisWeek:
        depositsWithdrawalsValues[0].thisWeek +
        depositsWithdrawalsValues[1].thisWeek -
        depositsWithdrawalsValues[2].thisWeek,
      thisMonth:
        depositsWithdrawalsValues[0].thisMonth +
        depositsWithdrawalsValues[1].thisMonth -
        depositsWithdrawalsValues[2].thisMonth,
    };

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data: {
        depositsFTD: depositsWithdrawalsValues[0],
        depositsRepeat: depositsWithdrawalsValues[1],
        depositsWithdrawals: depositsWithdrawalsValues[2],
        depositsNet,
        noOfFTD: depositsWithdrawalsValues[3],
        targets: depositsWithdrawalsValues[4]
      },
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('retention-deposit-withdrawal')
  async getRetentionDepositWithdrawal(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters = await this.leadsService.getFiltersForDashboard({ userId: user.id, }, WidgetType.RETENTION_REP);
    const filters2: any = await this.leadsService.getLeadsListForDashboard({ userId: user.id });

    const depositsWithdrawalsValues =
      await this.dashboardService.getDepositsWithdrawalValueForOperator({ ...filters, operatorFilter: filters2.operatorFilter }, timeZone);

    const depositsNet = {
      today:
        depositsWithdrawalsValues[0].today +
        depositsWithdrawalsValues[1].today -
        depositsWithdrawalsValues[2].today,
      thisWeek:
        depositsWithdrawalsValues[0].thisWeek +
        depositsWithdrawalsValues[1].thisWeek -
        depositsWithdrawalsValues[2].thisWeek,
      thisMonth:
        depositsWithdrawalsValues[0].thisMonth +
        depositsWithdrawalsValues[1].thisMonth -
        depositsWithdrawalsValues[2].thisMonth,
    };

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data: {
        depositsFTD: depositsWithdrawalsValues[0],
        depositsRepeat: depositsWithdrawalsValues[1],
        depositsWithdrawals: depositsWithdrawalsValues[2],
        depositsNet,
      },
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('deposit-target-achievement')
  async getDepositTargetAchievement(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data =
      await this.dashboardService.getIntervalWiseDepositWithdrawalTargets(
        filters,
        timeZone,
      );

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('team-opportunitites')
  async getTeamOpportunities(@GetUser() user: User) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.dashboardService.getTeamOpportunities(filters);

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('team-retention-opportunitites')
  async getTeamOpportunitiesRetention(@GetUser() user: User) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data =
      await this.dashboardService.getTeamOpportunitiesRetention(filters);

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('team-summary-lead-lifecycle')
  async getTeamLifeCycle(@GetUser() user: User) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.dashboardService.getTeamSummaryLifeCycle(filters);

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('team-summary-retention-lead-lifecycle')
  async getTeamLifeCycleRetention(@GetUser() user: User) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data =
      await this.dashboardService.getTeamSummaryLifeCycleRetention(filters);

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('team-summary-sales-status')
  async getTeamSalesStatus(@GetUser() user: User) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.dashboardService.getTeamSummarySales(filters);

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('team-summary-retention-sales-status')
  async getTeamSalesStatusRetention(@GetUser() user: User) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data =
      await this.dashboardService.getTeamSummarySalesRetention(filters);

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('volume-target-achievement')
  async getVolumeTargetAchievement(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data =
      await this.dashboardService.getInteravalWiseVolumeTargetAchievement(
        filters,
        timeZone.userDate,
      );

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('team-deposit-target-achievements')
  async getTeamDepositTarget(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.dashboardService.getDepositWithdrawalTargets(
      filters,
      timeZone,
    );

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('team-deposit-retention--target-achievements')
  async getTeamDepositTargetRetention(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data =
      await this.dashboardService.getDepositWithdrawalTargetsRetention(
        filters,
        timeZone,
      );

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('team-volume-target-achievements')
  async getTeamVolumeTarget(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.dashboardService.getTeamVolumeTargetAchievement(
      filters,
      timeZone.userDate,
    );

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('team-volume-retention-target-achievements')
  async getTeamRetentionVolumeTarget(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data =
      await this.dashboardService.getTeamVolumeTargetAchievementRetention(
        filters,
        timeZone.userDate,
      );

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('lead-summary-funded-deposits')
  async getleadSummaryFundedDeposits(@GetUser() user: User) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.dashboardService.getLeadSummaryFunded(filters);
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('inactive-clients')
  async getInactiveClients(@Query() query: QueryInactiveClientDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit;

    const { data, total } = await this.clientsService.getInactiveClients(
      {
        page,
        limit,
      },
      query.repId,
    );
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
      total,
    };
  }

  @Get('client-volume-target-achievements')
  async getClientVolumeTarget(
    @GetUser() user: User,
    @Query() pagination: PaginationDto,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const { data: jsonData, total } =
      await this.dashboardService.getClientsVolumeTagretAchievement(
        filters,
        pagination,
        timeZone.userDate,
      );

    let limit = pagination?.limit ?? 500;

    const { data, hasNextPage } = infinityPagination(jsonData, {
      page: pagination.page || 1,
      limit,
    });

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      result: {
        data,
        hasNextPage,
        total,
      },
    };
  }

  @Get('retention-volume-and-deposit-target-achievements')
  async getRetentionVolumeAndDepositTargetAchievement(
    @GetUser() user: User,
    @Query() pagination: PaginationDto,
    @ConvertTimezone() timeZone: { userCurrentDate: Date; utcOffsetMinutes: number },
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const { data: jsonData, total } =
      await this.dashboardService.getRetentionVolumeAndDepositTargetAchievement(
        filters,
        pagination,
        timeZone,
      );

    let limit = pagination?.limit ?? 500;

    const { data, hasNextPage } = infinityPagination(jsonData, {
      page: pagination.page || 1,
      limit,
    });

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      result: {
        data,
        hasNextPage,
        total,
      },
    };
  }

  @Get('kyc-status-count')
  async getKycStatusCount(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const kycCount = await this.dashboardService.getKycStatusCount(
      filters,
      timeZone,
    );
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data: {
        approved: kycCount[4],
        pending_review: kycCount[0],
        partial_kyc: kycCount[1],
        rejected: kycCount[2],
        no_kyc: kycCount[3],
        others: kycCount[5],
      },
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('psp-approved-failed-deposit-summary')
  async getPspApprovedAndFailedDepositSummary(@GetUser() user: User) {
    const filters = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.transactionWidgetsService.getPspApprovedAndFailedDepositSummary(filters)
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('method-psp-deposit-summary')
  async getDepositSummaryByMethodsAndPsp(@ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number }, @GetUser() user: User) {
    const filters = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.transactionWidgetsService.getDepositSummaryByMethodsAndPsp(timeZone.userDate, filters)
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('method-deposit-withdraw-summary')
  async getDepositAndWithdrawSummaryByMethods(@ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number }, @GetUser() user: User) {
    const filters = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.transactionWidgetsService.getDepositAndWithdrawSummaryByMethods(timeZone.userDate, filters)
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('highest-mt5-credits')
  async getHighestMt5CreditAccounts(@GetUser() user: User) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });

    const data = await this.dashboardService.getHighestMt5CreditAccounts(
      user.id,
      filters,
    );

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('net-deposit-and-psp-summary')
  async getNetDepositPspSettlement(@ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number }) {
    const data =
      await this.transactionWidgetsService.getNetDepositPspSettlement(timeZone.userDate);
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('leads-and-clients-summary')
  async getClientsSummary(@GetUser() user: User, @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number }) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const data = await this.dashboardService.getLeadsAndClientSummary(filters, timeZone.userDate);
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('operator/productivity-summary')
  async getOwnProductivitySummary(
    @GetUser() user: User,
    @Query() query: OperatorProductivitySummaryQueryDto,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number }
  ) {
    return this.dashboardService.getOwnOperatorProductivitySummary(user, query.interval, timeZone.userDate);
  }
}
