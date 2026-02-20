import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IbService } from './ib.service';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import {
  QueryIbClients,
  QueryIbLinks,
  QuerySubIbs,
} from './dtos/ib-client-filters.dto';
import {
  IbClientCreateLinkDto,
  IbClientUpdateLinkDto,
} from './dtos/ib-client-create-link.dto';
import { PartnerService } from 'src/admin/partner/partner.service';
import { RoleEnum } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { ConvertTimezone } from 'src/common/decorators/timezone.decorator';
import { PerformancePeriod } from './dtos/sub-ib-performance.dto';
import {
  CommissionReportPaginationDto,
  CommissionReportQueryDto,
  CommissionReportResponseDto,
  QueryOptionsDto,
} from './dtos/ib-commission-report.dto';
import { GetTransactionList } from 'src/transaction/dto/get-transaction.list';
import { GetAccountsRequest } from 'src/mt5/client/dto/get-account.dto';
import {
  AuthRegisterLoginDto,
  AuthRegisterQueryDto,
} from 'src/auth/dto/auth-register-login.dto';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { UpdateGeneratedLinkDto } from 'src/admin/partner/dto/generate-partner-link.dto';
import { AuthOnboardClientDto } from 'src/auth/dto/ib-auth-dto';

@ApiBearerAuth()
@Roles(RoleEnum.client)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('IB Clients')
@Controller({
  path: 'ib',
  version: '1',
})
export class IbController {
  constructor(
    private readonly ibService: IbService,
    private readonly partnerService: PartnerService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  @Get('clients/profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Onboard Clients for IB' })
  @ApiResponse({
    status: 200,
    description: 'Onboard clients data fetched successfully',
  })
  async onboardClients(@GetUser() user: User) {
    const data = await this.ibService.getAllOnboardClients({
      user,
    });

    return ResponseWrapper.wrap({
      status: 0,
      statusCode: HttpStatus.OK,
      statusText: 'Onboard clients data fetched successfully',
      data,
    });
  }

  @Post('clients/onboard')
  @HttpCode(HttpStatus.CREATED)
  async onboardClientsByPartner(
    @Body() createUserDto: AuthOnboardClientDto,
    @GetUser() user: User,
  ) {
    return this.ibService.onboardClientByPartner(createUserDto, user);
  }

  @Patch('update-link/:id')
  @HttpCode(HttpStatus.OK)
  async updatePartnerLink(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGeneratedLinkDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.partnerService.updatePartnerLink(id, dto, user.id);
  }

  @Get('clients/list')
  @HttpCode(HttpStatus.OK)
  async getAll(@Query() query: QueryIbClients, @GetUser() user: User) {
    const data = await this.ibService.findManyClientsWithPagination({
      userId: user.id,
      query,
    });
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Clients fetched successfully',
      data,
    });
  }

  @Get('clients/:id')
  @HttpCode(HttpStatus.OK)
  async findOneClientById(@Param('id') id: number, @GetUser() user: User) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Client fetched successfully',
      data: await this.ibService.findOneClientById(id, user.id,true),
    });
  }

  @Get('leads/list')
  async getAllLeads(@Query() query: QueryIbClients, @GetUser() user: User) {
    const data = await this.ibService.findManyLeadsWithPagination({
      userId: user.id,
      query,
    });
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Leads fetched successfully',
      data,
    });
  }

  @Get('leads/:id')
  @HttpCode(HttpStatus.OK)
  async findOneLeadById(@Param('id') id: number, @GetUser() user: User) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Lead fetched successfully',
      data: await this.ibService.findOneLeadById(id, user.id,true),
    });
  }

  @Post('create-link')
  @HttpCode(HttpStatus.OK)
  async createLink(
    @Request() req,
    @Body() dto: IbClientCreateLinkDto,
    @GetUser() user: User,
  ) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Link Created Successfully',
      data: await this.ibService.createPartnerLink(req.headers, dto, user.id),
    });
  }

  @Get('links/list')
  async getAllLinks(@Query() query: QueryIbLinks, @GetUser() user: User) {
    const data = await this.ibService.findManyLinksWithPagination({
      userId: user.id,
      query,
    });
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Links fetched successfully',
      data,
    });
  }

  @Get('links/:id')
  @HttpCode(HttpStatus.OK)
  async findOneLinkById(@Param('id') id: number, @GetUser() user: User) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Link fetched successfully',
      data: await this.ibService.findOneLinkById(id, user.id),
    });
  }

  @Patch('links/:id')
  @HttpCode(HttpStatus.OK)
  async updateLink(
    @Param('id') id: number,
    @Body() dto: IbClientUpdateLinkDto,
    @GetUser() user: User,
  ) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Link updated successfully',
      data: await this.ibService.updateLink(id, dto, user.id),
    });
  }

  @Delete('links/:id')
  @HttpCode(HttpStatus.OK)
  async deleteLink(@Param('id') id: number, @GetUser() user: User) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Link deleted successfully',
      data: await this.ibService.deleteLink(id, user.id),
    });
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats(@GetUser() user: User) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Stats fetched successfully',
      data: await this.ibService.getStats(user.id),
    });
  }

  @Get('applicants/list')
  @HttpCode(HttpStatus.OK)
  async getAllApplicants(
    @Query() query: QueryIbClients,
    @GetUser() user: User,
  ) {
    const data = await this.ibService.findManyApplicantsWithPagination({
      userId: user.id,
      query,
    });
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Applicants fetched successfully',
      data,
    });
  }

  @Get('applicants/:id')
  @HttpCode(HttpStatus.OK)
  async findOneApplicantsById(@Param('id') id: number, @GetUser() user: User) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Applicant fetched successfully',
      data: await this.ibService.findOneApplicantsById(id, user.id, true),
    });
  }

  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['today', 'week', 'month', 'quarter', 'year'],
    example: 'month',
  })
  @Get('deposit-funds-summary')
  @HttpCode(HttpStatus.OK)
  async depositFundSummary(
    @GetUser() user: User,
    @ConvertTimezone()
    timeZone: { userDate: Date; utcOffsetMinutes: number },
    @Query('period')
    period: 'today' | 'week' | 'month' | 'quarter' | 'year' = 'month',
  ) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Deposit Fund Summary',
      data: await this.ibService.depositFundSummary(
        user.id,
        period,
        timeZone.userDate,
      ),
    });
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('leads-clients-summary')
  async getLeadClientsSummary(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const data = await this.ibService.getLeadClientsSummary(
      user.id,
      timeZone.userDate,
    );
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('client-deposit-target')
  async getClientDepositTarget(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const data = await this.ibService.getClientDepositTarget(user.id, timeZone);

    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @Get('sub-ibs/list')
  @HttpCode(HttpStatus.OK)
  async getAllSubIbs(@Query() query: QuerySubIbs, @GetUser() user: User) {
    const data = await this.ibService.getAllSubIbs({
      userId: user.id,
      query,
    });
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Sub Ibs fetched successfully',
      data,
    });
  }

  @Get('sub-ibs/:id')
  @HttpCode(HttpStatus.OK)
  async findOneSubIbById(@Param('id') id: number, @GetUser() user: User) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Sub Ib fetched successfully',
      data: await this.ibService.findOneSubIbById(id, user.id, true),
    });
  }

  // Volume Commission Summary
  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('volume-commission-summary')
  async getVolumeCommissionSummary(
    @GetUser() user: User,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
    @Query('type') type: 'commission' | 'volume',
  ) {
    const data = await this.ibService.getVolumeCommissionSummary(
      user.id,
      timeZone.userDate,
      type,
    );
    return {
      message: 'Volume Commission Summary fetched successfully',
      statusCode: 200,
      data,
    };
  }

  @ApiHeaders([{ name: 'User_time_zone', schema: { type: 'string' } }])
  @Get('sub-ibs-performance')
  @HttpCode(HttpStatus.OK)
  async getSubIbsPerformance(
    @GetUser() user: User,
    @Query('period') period: PerformancePeriod = PerformancePeriod.MONTH,
    @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    const data = await this.ibService.getSubIbsPerformance(
      user.id,
      period,
      timeZone,
    );
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Sub IBs performance fetched successfully',
      data,
    });
  }

  @Get('ib-hierarchy')
  @HttpCode(HttpStatus.OK)
  async getIbHierarchy(@GetUser() user: User) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB Hierarchy fetched successfully',
      data: await this.ibService.getIbHierarchy(user.id),
    });
  }

  @Get('registration-links-stats')
  @HttpCode(HttpStatus.OK)
  async getRegistrationStats(@GetUser() user: User) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Registration stats fetched successfully',
      data: await this.ibService.getRegistrationStats(user.id),
    });
  }

  @Get('top-performing-clients')
  @HttpCode(HttpStatus.OK)
  async getTopClientsByCommission(
    @GetUser() user: User,
    @Query('period') period: 'today' | 'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear' | 'all' = 'thisMonth',
  ) {
    const data = await this.ibService.getTopClientsByCommission(
      user.id,
      period,
    );
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Top clients by commission fetched successfully',
      data,
    });
  }

  @Get('commission-report')
  @ApiOperation({
    summary: 'Get commission report',
    description:
      'Retrieve paginated commission report with optional date filtering and search',
  })
  @ApiResponse({
    status: 200,
    description: 'Commission report retrieved successfully',
    type: CommissionReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiQuery({ name: 'subIbId', required: false, type: Number })
  async getCommissionReport(
    @GetUser() user: User,
    @Query() query: CommissionReportQueryDto,
    @Query('subIbId') subIbId?: number,


  ): Promise<CommissionReportResponseDto> {
    return this.ibService.getCommissionReport(user, query , subIbId) ;
  }

@Get('commission-report/:login')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Get commission report with pagination',
})
@ApiResponse({
  status: 200,
  description: 'Commission report retrieved successfully with pagination',
})
@ApiResponse({
  status: 400,
  description: 'Invalid parameters',
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
async getClientCommissionReport(
  @GetUser() user: User,
  @Param('login') login: string,
  @Query() query: CommissionReportPaginationDto,
): Promise<any> {
  return this.ibService.getClientCommissionReport(user, +login, query);
}

  @Get('commission-stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get commission stats' })
  @ApiQuery({ name: 'type', required: false, enum: ["all", "client", "subIb"] })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'subIbId', required: false, type: Number })
  async getCommissionStats(
    @GetUser() user: User,
    @Query('type') type?: string,
    @Query('userId') userId?: number,
    @Query('subIbId') subIbId?: number,
  ): Promise<any> {
    return this.ibService.getCommissionStats(user, type, userId,subIbId);
  }


@Get('sub-ib-breakdown-report')
@HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get sub-IB breakdown report',
  })
  @ApiResponse({
    status: 200,
    description: 'Sub-IB breakdown retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
async getSubIbBreakdown(
  @GetUser() user: User,
  @Query() query: QueryOptionsDto,
): Promise<any> {
  if (query.partnerId) {
    return this.ibService.getPartnerClientsBreakdown(
      user,
      { ...query, partnerId: query.partnerId },
      true,
    );
  }

  if (query.subIbId) {
    return this.ibService.getSubIbBreakdown(
      user,
      { ...query, subIbId: query.subIbId },
      true,
    );
  }
  return this.ibService.getSubIbBreakdown(user, query, true);
}

@Get('sub-ib-stats')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Get sub-IB breakdown report' })
@ApiResponse({ status: 200, description: 'Sub-IB breakdown retrieved successfully' })
@ApiResponse({ status: 400, description: 'Invalid parameters' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async getSubPartnersCount(
  @GetUser() user: User,
  @Query('subIbId') subIbId?: string,
  @Query('period') period?: 'monthly' | 'quarterly' | 'yearly',
) {
  const subIbIdNum = subIbId ? parseInt(subIbId, 10) : undefined;

  const validPeriod = period || 'monthly';

  return this.ibService.getSubIbStats(user, subIbIdNum, validPeriod);
}
  @Get('transactions/:clientId')
  @HttpCode(HttpStatus.OK)
  async getTransactions(
    @Query() query: GetTransactionList,
    @GetUser() user: User,
    @Param('clientId') clientId: number
  ) {
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Applicant fetched successfully',
      data: await this.ibService.getTransactionList(query, user, clientId),
    });
  }

    
@Get('trading-accounts/:userId')
@HttpCode(HttpStatus.OK)
async getTradingAccounts(
  @Param() getAllAccountsDto: GetAccountsRequest,
  @GetUser() user: User
) {
  const userId = +getAllAccountsDto.userId;

  const merged = await this.ibService.getClientTradingAccount(userId, user.id);

 return {
    live: merged,
  };
}
}