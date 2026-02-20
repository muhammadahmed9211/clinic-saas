import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { AuthEmailExistsDto } from 'src/auth/dto/auth-email-exists.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { JobService } from 'src/jobs-processor/job.service';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { User } from 'src/users/entities/user.entity';
import { TaskEntityType } from '../task/entities/task.entity';
import { TaskService } from '../task/task.service';
import { AddAnswerDto } from './dto/add-answer.dto';
import { CreateLeadDto, TelephoneExistLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsService } from './leads.service';
import { GetAllClientsQueryDto } from 'src/users/dto/get-all-clients-query.dto';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { DashboardService } from '../dashboard/dashboard.service';
import { UpdateSalesStatusDto } from './dto/update-sales-status.dto';
import { UpdateRetentionStatusDto } from './dto/update-retention-status.dto';
import { MassAssignSalesDto } from './dto/mass-assign-sales.dto';
import { PurgeLeadsDto } from './dto/purge-lead.dto';
import { UnPurgeLeadsDto } from './dto/unpurge-leads.dto';
import { MassAssignRetentionDto } from './dto/mass-assign-retention.dto';
import { MassAssignOfficeDto } from './dto/mass-assign-office.dto';
import { MassAssignPartnerDto } from './dto/mass-assign-partner.dto';
import { MassAssignSalesDeskDto } from './dto/mass-assign-salesDesk.dto';
import { ConvertTimezone } from 'src/common/decorators/timezone.decorator';
import { TransferRetentionDto } from './dto/transfer-retention.dto';
import { MassTransferRetentionDto } from './dto/mass-transfer-retention.dto';

@Controller({ path: 'admin/leads', version: '1' })
@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly taskService: TaskService,
    private readonly jobService: JobService,
    private readonly dashboardService: DashboardService,
  ) { }

  @Post()
  create(@Body() createLeadDto: CreateLeadDto, @GetUser() user: User) {
    return this.leadsService.create(createLeadDto, user);
  }

  @Post('list')
  async getAllLeads(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.leadsService.getLeadsList({
      userId,
      limit,
      page,
      dto: body,
    });
  }
  @Post('listIb')
  async getAllLeadsIb(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.leadsService.getAllLeadsIb({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @Post('listAllIb')
  async getAllIb(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.leadsService.getAllIb({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @Post('list/purged')
  async purgedLeadsAndClients(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.leadsService.purgedLeadsAndClients({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @Post('list/deactivated')
  async getDeactivatedLeadsAndClients(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;

    return this.leadsService.deactivatedLeadsAndClients({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @Post('listIb/purged')
  async purgedIb(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.leadsService.purgedIb({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @Post('list/all')
  async getAllLeadAndClients(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.leadsService.getAllLeadsAndClients({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @Post('list/automation')
  async getAllLeadsAutomation(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.leadsService.getLeadsListAutomation({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  // to be removed later
  // @Get()
  // findAll(@Query() query: GetAllClientsQueryDto) {
  //   const search = query?.search || '';
  //   return this.leadsService.findAll(search);
  // }

  @Get()
  async getallLeads(
    @GetUser() user: User,
    @Query() query: GetAllClientsQueryDto,
  ) {
    const userId = user.id;
    const filter = {
      listColumnMeta: {
        name: 'isActive',
      },
      operator: FilterOperation.EQUALS,
      values: [true],
    };
    const searchFilter = {
      listColumnMeta: {
        name: 'firstName',
      },
      operator: FilterOperation.CONTAINS,
      values: [query.search || ''],
    };
    const data = await this.leadsService.getLeadsListForDropdown({
      userId,
      all: true,
      dto: {
        //@ts-expect-error typeerror
        filters: [filter, searchFilter],
      },
    });

    const mappedResult = data.result.map((item) => ({
      id: item?.id,
      firstName: item?.firstName ?? '',
      lastName: item?.lastName ?? '',
      title: item?.title ?? '',
    }));
    return mappedResult;
  }

  @Post(':id/tasks/list')
  findAllTasks(
    @Param('id') id: string,
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDto,
    @GetUser() user: User,
  ) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    return this.taskService.advanceFilters({
      paginationOptions: {
        page,
        limit,
      },
      userId: user.id,
      body,
      entity: TaskEntityType.LEAD,
      entityId: id,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.leadsService.findOne(+id, user);
  }

  @Get(':id/answers')
  getAnswers(@Param('id') leadId: string) {
    return this.leadsService.getAnswers(+leadId);
  }

  @Post('add-answer/:id')
  addAnswer(@Param('id') leadId: string, @Body() addAnswerDto: AddAnswerDto) {
    return this.leadsService.addAnswer(+leadId, addAnswerDto);
  }

  @Post('update-answer/:id')
  updateAnswer(
    @Param('id') leadId: string,
    @Body() addAnswerDto: AddAnswerDto,
  ) {
    return this.leadsService.updateAnswer(+leadId, addAnswerDto);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @GetUser() user: User,
  ) {
    return this.leadsService.update(+id, updateLeadDto, user);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.leadsService.remove(+id, user);
  }

  @ApiOperation({ summary: 'Upload CSV file Endpoint' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        verificationId: {
          type: 'string',
        },
      },
    },
  })
  @Post('/upload-leads')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { files: 1, fileSize: 5000 * 5000 * 5 }, // 1 MB you can adjust size here
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['text/csv'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(new BadRequestException('Invalid file type'), false);
        } else if (file?.size > 5000 * 5000 * 5) {
          // 1MB
          cb(
            new BadRequestException('Max File Size Reached. Max Allowed: 5MB'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadCsvFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<any> {
    const userId = user?.id;
    const userName: string = user?.role?.name || '';
    if (!file) {
      throw new BadRequestException('File is required!');
    }
    try {
      const response: any = await this.leadsService.validateCsvData(
        file,
        userId,
        userName,
      );

      await this.jobService.addDataUploadJob(response);
      return {
        error: response?.error || false,
        statusCode: response?.status || HttpStatus.OK,
        message: response?.message || 'file uploaded successfully',
        data: response?.length || 0,
        errorsArray: response?.errorsArray || [],
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: e?.response?.error?.msg,
            userStatus: e?.response?.error?.status,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Post('email/isLeadExists')
  @HttpCode(HttpStatus.OK)
  async emailExists(@Body() emailExistsDto: AuthEmailExistsDto): Promise<any> {
    const exists = await this.leadsService.IsLeadExistByEmail(emailExistsDto);
    return { exists };
  }

  @Put('mass-assign/sales-rep')
  @HttpCode(HttpStatus.OK)
  async massAssignSalesRep(
    @Body() massAssignSalesDto: MassAssignSalesDto,
    @GetUser() user: User,
  ): Promise<any> {
    try {
      const assigned = await this.leadsService.massAssignSalesRep(
        massAssignSalesDto,
        user,
      );
      return {
        statusCode: HttpStatus.OK,
        data: assigned,
        message:
          'Sales representative successfully assigned to all provided leads.',
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('mass-purge')
  @HttpCode(HttpStatus.OK)
  async purgeLeads(
    @Body() purgeLeadsDto: PurgeLeadsDto,
    @GetUser() user: User,
  ): Promise<any> {
    const leadIds = purgeLeadsDto.leadIds;
    await this.leadsService.purgeLeads(leadIds, user);
    return { success: true, message: 'Leads purged successfully' };
  }

  @Put('mass-deactivate')
  @HttpCode(HttpStatus.OK)
  async massDeactivateLeads(
    @Body() purgeLeadsDto: PurgeLeadsDto,
    @GetUser() user: User,
  ): Promise<any> {
    const leadIds = purgeLeadsDto.leadIds;
    await this.leadsService.massDeactivateLeads(leadIds, user);
    return { success: true, message: 'Leads deactivated successfully' };
  }

  @Put('mass-unpurge')
  @HttpCode(HttpStatus.OK)
  async unPurgeLeads(
    @Body() unPurgeLeadsDto: UnPurgeLeadsDto,
    @GetUser() user: User,
  ): Promise<any> {
    const leadIds = unPurgeLeadsDto.leadIds;
    const data = await this.leadsService.unPurgeLeads(leadIds, user);
    return { success: true, message: 'Leads unPurged Successfully', data: data };
  }

  @Put('mass-activate')
  @HttpCode(HttpStatus.OK)
  async massActivate(
    @Body() unPurgeLeadsDto: UnPurgeLeadsDto,
    @GetUser() user: User,
  ): Promise<any> {
    const leadIds = unPurgeLeadsDto.leadIds;
    const data = await this.leadsService.massActivateLeads(leadIds, user);
    return { success: true, message: 'Leads Activated Successfully', data: data };
  }

  @Put('mass-delete')
  @HttpCode(HttpStatus.OK)
  async massDelete(
    @Body() purgeLeadsDto: PurgeLeadsDto,
    @GetUser() user: User,
  ): Promise<any> {
    const leadIds = purgeLeadsDto.leadIds;
    await this.leadsService.massDelete(leadIds, user);
    return { success: true, message: 'Leads Deleted successfully' };
  }

  // @Put('mass-restore')
  // @HttpCode(HttpStatus.OK)
  // async massRestore(
  //   @Body() purgeLeadsDto: PurgeLeadsDto,
  //   @GetUser() user: User,
  // ): Promise<any> {
  //   const leadIds = purgeLeadsDto.leadIds;
  //   await this.leadsService.massRestore(leadIds, user);
  //   return { success: true, message: 'Leads massRestore successfully' };
  // }

  @Put('mass-assign/retention-rep')
  @HttpCode(HttpStatus.OK)
  async massAssignRetentionRep(
    @Body() massAssignRetentionDto: MassAssignRetentionDto,
    @GetUser() user: User,
  ): Promise<any> {
    try {
      const assigned = await this.leadsService.massAssignRetentionRep(
        massAssignRetentionDto,
        user,
      );
      return {
        statusCode: HttpStatus.OK,
        data: assigned,
        message: 'Retention representative successfully assigned',
      };
    } catch (error) {
      throw error;
    }
  }
  @Patch('mass-assign/office')
  @HttpCode(HttpStatus.OK)
  async massAssignOffice(
    @Body() massAssignOfficeDto: MassAssignOfficeDto,
    @GetUser() user: User,
  ): Promise<any> {
    try {
      const assigned = await this.leadsService.MassAssignOffice(
        massAssignOfficeDto,
        user,
      );
      return {
        statusCode: HttpStatus.OK,
        data: assigned,
        message: 'Office successfully assigned',
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('mass-assign/partner')
  @HttpCode(HttpStatus.OK)
  async massAssignPartnerRep(
    @Body() massAssignPartnerDto: MassAssignPartnerDto,
    @GetUser() user: User,
  ): Promise<any> {
    try {
      const assigned = await this.leadsService.massAssignPartner(
        massAssignPartnerDto,
        user,
      );
      return {
        statusCode: HttpStatus.OK,
        data: assigned,
        message: 'Partner successfully assigned',
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('mass-assign/sales-desk')
  @HttpCode(HttpStatus.OK)
  async massAssignSalesDesk(
    @Body() massAssignSalesDeskDto: MassAssignSalesDeskDto,

    @GetUser() user: User,
  ): Promise<any> {
    try {
      const assigned = await this.leadsService.massAssignSalesDesk(
        massAssignSalesDeskDto,
        user,
      );
      return {
        statusCode: HttpStatus.OK,
        data: assigned,
        message: 'Sales desk successfully assigned to all provided leads.',
      };
    } catch (error) {
      throw error;
    }
  }
  @Get(':id/call-counts')
  async getLeadCallCounts(@Param('id') id: number, @GetUser() user: User, @ConvertTimezone() timeZone: { userDate: Date; utcOffsetMinutes: number }, @Request() req: any) {
    const filters: any = await this.leadsService.getLeadsListForDashboard({
      userId: user.id,
    });
    const userTimeZone = req.headers.user_time_zone;
    const counts = await this.dashboardService.getCallCounts(filters, timeZone, userTimeZone, id.toString());
    return {
      message: 'Data fetched successfully',
      statusCode: 200,
      data: counts,
    };
  }

  @Get(':id/user-latest-tasks')
  async userLatestTask(@Param('id') id: string, @GetUser() user: User) {
    const data = await this.taskService.findByUser(
      user,
      {
        filters: [
          {
            listColumnMeta: { name: 'entity' },
            operator: FilterOperation.EQUALS,
            values: [TaskEntityType.LEAD],
          },
          {
            listColumnMeta: { name: 'entityId' },
            operator: FilterOperation.EQUALS,
            values: [id],
          },
        ],
        sort: []
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

  @Put('mass-update/sales-status')
  @HttpCode(HttpStatus.OK)
  async massUpdateSalesStatus(
    @Body() updateSalesStatusDto: UpdateSalesStatusDto,
    @GetUser() user: User,
  ): Promise<any> {
    const { leadIds, salesStatus } = updateSalesStatusDto;

    await this.leadsService.massUpdateSalesStatus(leadIds, salesStatus, user);
    return { success: true, message: 'Sales status updated successfully' };
  }

  @Put('mass-update/retention-status')
  @HttpCode(HttpStatus.OK)
  async massUpdateRetentionStatus(
    @Body() updateRetentionStatusDto: UpdateRetentionStatusDto,
    @GetUser() user: User,
  ): Promise<any> {
    const { clientIds, retentionStatusId } = updateRetentionStatusDto;

    await this.leadsService.massUpdateRetentionStatus(clientIds, retentionStatusId, user);
    return { success: true, message: 'Retention status updated successfully' };
  }

  @Patch(':id/toggle-transfer-sales-retention')
  @HttpCode(HttpStatus.OK)
  async updateTransferRetention(
    @Param('id') id: string,
    @Body() transferRetentionDto: TransferRetentionDto,
    @GetUser() user: User,
  ) {
    return this.leadsService.toggleTransferSalesRetention(+id, transferRetentionDto, user);
  }

  @Put('mass-update/transfer-retention')
  @HttpCode(HttpStatus.OK)
  async massUpdateTransferRetention(
    @Body() massTransferRetentionDto: MassTransferRetentionDto,
    @GetUser() user: User,
  ): Promise<any> {
    await this.leadsService.massUpdateTransferRetention(
      massTransferRetentionDto,
      user,
    );
    return { 
      success: true, 
      message: 'Transfer retention status updated successfully' 
    };
  }

  @Post('exists-by-telephone')
  @HttpCode(HttpStatus.OK)
  async leadExistsByTelephone(@Body() leadDto: TelephoneExistLeadDto): Promise<any> {
    const isExist = await this.leadsService.isLeadExistWithPhone(leadDto);
    return {
      statusCode: HttpStatus.OK,
      data: isExist,
    }
  }
}
