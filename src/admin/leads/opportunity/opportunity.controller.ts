import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  Request,
  Delete,
  ParseIntPipe,
  Req,
  Patch,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { OpportunityService } from './opportunity.service';
import {
  CreateEmailDto,
  CreateOpportunityDto,
} from './dto/create-opportunity.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { I18nContext } from 'nestjs-i18n';
import {
  AttachmentResponseDto,
  CreateAttachmentDto,
} from './dto/attachment.dto';
import {
  CreateLeadNoteDto,
  GetLeadNotesDto,
  UpdateLeadNoteDto,
} from './dto/notes.dto';
import { PaginationDto } from 'src/admin/kyc/dto/admin-kyc.dto';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import { UpdateOpportunityDto } from './dto/update-opportunity';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { EmailDto, EmailDtoByLead } from './dto/email.dto';

@Controller({ path: 'admin', version: '1' })
@ApiTags('Lead Opportunities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @ApiBearerAuth()
  @Get('lead/opportunity/email-inbox')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getMessages(@Query() query: EmailDto) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.opportunityService.getMessages({
      paginationOptions: {
        page,
        limit,
      },
    });
    const { hasNextPage, ...remainingData } = data;

    return { data: remainingData, hasNextPage };
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @ApiBearerAuth()
  @Get('lead/opportunity/email-inbox-by-lead')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getMessagesByLead(@Query() query: EmailDtoByLead) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.opportunityService.getMessagesByLead({
      paginationOptions: {
        page,
        limit,
      },
      leadId: query?.leadId,
    });
    const { hasNextPage, ...remainingData } = data;

    return { data: remainingData, hasNextPage };
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @ApiBearerAuth()
  @Get('lead/opportunity/email-inbox/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getMessageById(@Param('id') id: number) {
    const data = await this.opportunityService.getInboxEmailById({
      id,
    });
    if (!data) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return { data };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('lead/opportunity/notes')
  @HttpCode(HttpStatus.OK)
  async createNotes(
    @Body() createLeadNoteDto: CreateLeadNoteDto,
    @Req() req: any,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const createdBy = req.user.id;
    await this.opportunityService.createNote(createLeadNoteDto, createdBy);
    const isSuccess = i18n?.t('success.client.noteCreated');
    return { success: true, message: isSuccess };
  }

  @Post('lead/opportunity/upload-attachment')
  async createAttachment(
    @Body() createAttachmentDto: CreateAttachmentDto,
    @Request() req: any,
  ): Promise<AttachmentResponseDto> {
    const attachedBy = req.user.id;
    return this.opportunityService.createAttachment(
      createAttachmentDto,
      attachedBy,
    );
  }

  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  // @Post('lead/opportunity/communication')
  // @HttpCode(HttpStatus.OK)
  // async createCommunication(
  //   @Body() createEmailDto: CreateEmailDto,
  //   @Request() request,
  // ): Promise<{ message: string }> {
  //   const i18n = I18nContext.current();
  //   const operatorId = request.user.id;
  //   console.log('operatorId: ', operatorId);

  //   const updatedCreateCommunicationDto = {
  //     ...createEmailDto,
  //     operatorId,
  //   };

  //   await this.opportunityService.createEmail(updatedCreateCommunicationDto);

  //   const isSuccess = i18n?.t('success.email.success');

  //   return {
  //     message: `${isSuccess}`,
  //   };
  // }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('lead/opportunity/communication')
  @HttpCode(HttpStatus.OK)
  async createCommunication(
    @Body() createEmailDto: CreateEmailDto,
    @Request() request,
  ): Promise<{ message: string }> {
    const i18n = I18nContext.current();
    const operatorId = request.user.id;

    const updatedCreateCommunicationDto = {
      ...createEmailDto,
      operatorId,
    };

    await this.opportunityService.createEmail(updatedCreateCommunicationDto);

    const isSuccess = i18n?.t('success.email.success');

    return {
      message: `${isSuccess}`,
    };
  }
  @Post('lead/:id/opportunity')
  async create(
    @GetUser() user: User,
    @Param('id') lead: number,
    @Body() data: CreateOpportunityDto,
  ) {
    return await this.opportunityService.create(lead, data, user.id);
  }

  @Post('lead/opportunity/stage-kanban')
  async getOpportunityKanbanView(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;

    const { limit = 10, page = 1 } = query;
    return await this.opportunityService.getOpportunityKanbanView({
      userId,
      limit: limit || 10,
      page: page || 1,
      all: true,
      dto: body,
    });
  }

  @Get('lead/opportunities/stats')
  @HttpCode(HttpStatus.OK)
  async getOpportunitiesStats(@GetUser() user: User) {
    return await this.opportunityService.getOpportunitiesStats(user);
  }

  @Get('lead/:id/opportunity/count')
  async opportunityCount(@Param('id') id: number) {
    return await this.opportunityService.getOpportunityCount(id);
  }

  @Get('lead/opportunity/:id')
  async getOpportunityDetail(@Param('id') opportunityId: number) {
    return await this.opportunityService.opportunityDetail(opportunityId);
  }

  @Get('lead/:id/opportunity/stage-kanban')
  async getKanbanView(@Param('id') id: number) {
    return await this.opportunityService.opportunityKanbanView(id);
  }

  @Get('lead/:id/opportunity/:oid/attachments')
  async getAllAttachments(
    @Param('id') id: number,
    @Param('oid') oid: number,
  ): Promise<AttachmentResponseDto[]> {
    return this.opportunityService.getAllAttachments(+id, +oid);
  }

  @Get('lead/opportunity/:id/open-activity')
  async getOpenActivity(@Param('id') id: number) {
    return this.opportunityService.getOpenActivity(+id);
  }

  @Post('lead/:id/opportunity/list')
  async getOpportunitiesByLeadId(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
    @Param('id') id: number,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return await this.opportunityService.getOpportunitiesByLeadId({
      userId,
      limit,
      page,
      dto: body,
      leadId: id,
    });
  }

  @Post('lead/opportunities')
  async getAllOpportunities(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return await this.opportunityService.getAllOpportunities({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @Get('lead/opportunity/funnel/all')
  async getStages() {
    return await this.opportunityService.getStages();
  }

  @Delete('lead/opportunity/attachment/:id')
  async softDeleteAttachment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.opportunityService.softDeleteAttachment(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('lead/opportunity/notes/:id')
  @HttpCode(HttpStatus.OK)
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKycNoteDto: UpdateLeadNoteDto,
    @Req() req: any,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const createdBy = req.user.id;
    await this.opportunityService.updateLeadNote(
      id,
      updateKycNoteDto,
      createdBy,
    );
    const isSuccess = i18n?.t('success.client.noteUpdated');
    return { success: true, message: isSuccess };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('lead/:id/opportunity/notes-type')
  async getLeadTypeNotes(
    @Param('id') id: number,
    @Query() getKycNotesDto: GetLeadNotesDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<notes[]> {
    const { page, limit } = paginationDto;
    const opportunityId = getKycNotesDto.opportunity_id;
    const type = getKycNotesDto.type;
    const paginationOptions = paginationDto ? { page, limit } : undefined;

    const data = await this.opportunityService.getLeadNotes(
      id,
      type,
      opportunityId,
      getKycNotesDto.meeting_id,
      getKycNotesDto.call_id,
      getKycNotesDto.ticket_id,
      paginationOptions,
    );

    return data;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('lead/:id/opportunity/notes-all')
  async getLeadAllNotes(
    @Param('id') id: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<notes[]> {
    const { page, limit } = paginationDto;
    const paginationOptions = paginationDto ? { page, limit } : undefined;

    const data = await this.opportunityService.getLeadNotesAll(
      id,
      paginationOptions,
    );

    return data;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('notes-all')
  @HttpCode(HttpStatus.OK)
  async getAllPartners(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    return this.opportunityService.getAllNotes(
      query.limit || 10,
      query.page || 1,
      user.id,
      body,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('getAllNotesStats')
  async getNotesStats(@GetUser() user: User) {
    return await this.opportunityService.getNotesStats(user.id);
  }

  @Get('lead/opportunity/:id/stage-history')
  async getStageHistory(@Param('id') id: number) {
    return await this.opportunityService.getStageHistory(id);
  }

  @Patch('lead/opportunity/:id/update')
  async updateOpportunity(
    @Param('id') id: number,
    @Body() body: UpdateOpportunityDto,
    @GetUser() user: User,
  ) {
    return await this.opportunityService.updateOpportunity(id, body, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete('lead/opportunity/notes/:id')
  async softDeleteKycNote(@Param('id') id: number, @GetUser() user: User,): Promise<any> {
    const i18n = I18nContext.current();
    await this.opportunityService.softDeleteLeadNote(id, user.id);
    const isSuccess = i18n?.t('success.client.noteDeleted');
    return { success: true, message: isSuccess };
  }
}
