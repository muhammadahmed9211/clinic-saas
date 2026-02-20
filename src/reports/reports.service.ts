import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PaginationDto,
  PaginationDtoForIBCommissionClientWiseReport,
  PaginationDtoForSubIbReport,
} from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { User } from 'src/users/entities/user.entity';
import { ReportsRepository } from './repositories/reports.repository';
import { LeadsService } from 'src/admin/leads/leads.service';
import { WidgetType } from 'src/database/base-repository/base-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from 'src/settings/entities/partner.entity';
import { Repository } from 'typeorm';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly leadsService: LeadsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
  ) {}
  async getRetentionList(
    user: User,
    body: ApplyListFilterSortColumnDto,
    query: PaginationDto,
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    return this.reportsRepository.getRetentionVolumeTargets(
      filters,
      query,
      user.id,
      body,
    );
  }

  async getMt5AccountsList(
    user: User,
    body: ApplyListFilterSortColumnDto,
    query: PaginationDto,
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    return this.reportsRepository.getClientsMt5AccountSummary(
      filters,
      query,
      user.id,
      body,
    );
  }

  async getClientList(
    user: User,
    body: ApplyListFilterSortColumnDto,
    query: PaginationDto,
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    return this.reportsRepository.getClientsVolumeTargets(
      filters,
      query,
      user.id,
      body,
    );
  }

  async getIbCommission(
    user: User,
    body: ApplyListFilterSortColumnDto,
    query: PaginationDto,
  ) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    return this.reportsRepository.getIbCommisionReport(
      filters,
      query,
      user.id,
      body,
    );
  }
  async opeteratorReport(
    user: User,
    body: ApplyListFilterSortColumnDto,
    query: PaginationDto,
  ) {
    return this.reportsRepository.getOperatorProductivity(query, user.id, body);
  }

  async getSalesDashboard(
    query: PaginationDto,
    timeZone: { userDate: Date; utcOffsetMinutes: number },
    user: User,
  ) {
    const salesFilters = await this.leadsService.getFiltersForDashboard(
      { userId: user.id },
      WidgetType.SALES_REP,
    );
    const salesDashboard = await this.reportsRepository.getSalesTeamDashboard(
      query,
      timeZone,
      WidgetType.SALES_REP,
      salesFilters,
    );

    const retentionFilters = await this.leadsService.getFiltersForDashboard(
      { userId: user.id },
      WidgetType.RETENTION_REP,
    );
    const retentionDashboard =
      await this.reportsRepository.getSalesTeamDashboard(
        query,
        timeZone,
        WidgetType.RETENTION_REP,
        retentionFilters,
      );

    const totalActiveReps =
      (salesDashboard?.statistics?.activeReps || 0) +
      (retentionDashboard?.statistics?.activeReps || 0);
    const totalDeposit =
      (salesDashboard?.statistics?.totalDeposit || 0) +
      (retentionDashboard?.statistics?.totalDeposit || 0);
    const totalWithdrawal =
      (salesDashboard?.statistics?.totalWithdrawal || 0) +
      (retentionDashboard?.statistics?.totalWithdrawal || 0);
    const totalNetDeposit = totalDeposit - totalWithdrawal;

    // Combine topAchievers
    const combinedTopAchievers = [
      ...(salesDashboard?.statistics?.topAchievers || []),
      ...(retentionDashboard?.statistics?.topAchievers || []),
    ];

    // Sort by netDeposit descending and pick top 3
    const topAchievers = combinedTopAchievers
      .sort((a, b) => (b?.netDeposit || 0) - (a?.netDeposit || 0))
      .slice(0, 3);

    return {
      salesDashboard,
      retentionDashboard,
      overallStatistics: {
        totalActiveReps,
        totalDeposit,
        totalWithdrawal,
        totalNetDeposit,
        topAchievers,
      },
    };
  }

  async getSubIbLevelReport(
    user: User,
    body: ApplyListFilterSortColumnDto,
    query: PaginationDtoForSubIbReport,
  ) {
    if (query.mt5Id) {
      return this.reportsRepository.subIbLevelReportQuery(
        query,
        user.id,
        body,
        query.mt5Id,
      );
    } else if(query.partnerId){
      return this.reportsRepository.subIbLevelClientReportQuery(
        query,
        user.id,
        body,
        query.partnerId
      )
    }
    else{
      // const client = await this.userRepository.findOne({
      //   where: { id: user.id },
      // });

      // if (!client?.partnerId) {
      //   throw new NotFoundException('IB not found');
      // }
      // const mainPartner = await this.partnerRepository.findOne({
      //   where: { id: client.partnerId },
      //   relations:['mt5Account']
      // });

      // if (!mainPartner) {
      //   throw new NotFoundException('Partner not found');
      // }
      return this.reportsRepository.subIbLevelReportQuery(query, user.id, body);
    }
  }

  async getIbCommissionReport(
    user: User,
    body: ApplyListFilterSortColumnDto,
    query: PaginationDtoForIBCommissionClientWiseReport,
  ) {
    if (query.partnerId) {
      return this.reportsRepository.getIbCommissionClientWiseReport(
        query,
        user.id,
        body,
        +query.partnerId,
      );
    }

    if (query.mt5Login) {
      return this.reportsRepository.getIbCommissionClientDealsReport(
        query,
        user.id,
        body,
        +query?.mt5Login,
      );
    }
    return this.reportsRepository.getIbCommissionReport(query, user.id, body);
  }
}
