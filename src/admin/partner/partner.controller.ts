import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Patch,
  SerializeOptions,
  UseGuards,
  Query,
  Put,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePartnerDTO } from './dto/create-partner.dto';
import {
  CreateKycNoteDto,
  GetKycNotesDto,
  PaginationDto,
  UpdateKycNoteDto,
} from '../kyc/dto/admin-kyc.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { TaskService } from '../task/task.service';
import { GetTaskQuery } from '../task/dto/task.dto';
import { I18nContext } from 'nestjs-i18n';
import { AdminKycService } from '../kyc/kyc.service';
import { notes } from '../kyc/entities/kycNotes.entity';
import { UpdatePartnerDTO } from './dto/update-partner.dto';
import {
  GeneratePartnerLinkDto,
  UpdateGeneratedLinkDto,
} from './dto/generate-partner-link.dto';
import { CreatePartnerLinkDto } from './dto/create-partner-link.dto';
import { TaskEntityType } from '../task/entities/task.entity';
import { UpdatePartnerConfigDto } from './dto/update-partner-config.dto';
import { UpdatePartnerLinkUrlDto } from './dto/update-partner-link.dto';
import { UpdatePartnerProfileAssignmentDto } from './dto/update-partner-profile-assignment.dto';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
// import { ResponseWrapper } from 'src/utils/response-wrapper';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin partner')
@Controller({
  path: 'admin/partner',
  version: '1',
})
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly tasksService: TaskService,
    private readonly adminKycService: AdminKycService,
  ) { }

  @Get('/partnerlinks/:id')
  @HttpCode(HttpStatus.OK)
  async getLinks(@Param('id') id: number) {
    return this.partnerService.getPartnerLinks(id);
  }

  @Get('dropdown')
  @ApiQuery({
    name: 'search',
    required: false,
  })
  async getPartnerDropDowns(@Query('search') search?: string): Promise<any> {
    return this.partnerService.getPartnersDowns(search);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('create-partner')
  @HttpCode(HttpStatus.OK)
  async createPartner(
    @Body() createPartnerDTO: CreatePartnerDTO,
    @Request() req,
  ): Promise<any> {
    const data = await this.partnerService.createPartner(
      createPartnerDTO,
      req.user,
    );
    return { data: data };
  }

  @Patch('/:id/configuration')
  @HttpCode(HttpStatus.OK)
  async updatePartnerConfig(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePartnerConfigDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.partnerService.updatePartnerConfig(id, dto, user);
  }


  @Patch("/:id/profile-assignment")
  @ApiOperation({ summary: 'Update partner profile assignment' })
  @ApiResponse({ status: 200, description: 'Partner profile assignment updated successfully' })
  @ApiResponse({ status: 400, description: 'Partner not found' })
  @HttpCode(HttpStatus.OK)
  async updatePartnerProfileAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePartnerProfileAssignmentDto,
    @GetUser() user: User,
  ): Promise<any> {
    const data = await this.partnerService.updatePartnerProfileAssignment(id, body, user);
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Partner profile assignment updated successfully',
      data,
    });
  }

  @Post('get-partners')
  @HttpCode(HttpStatus.OK)
  async getAllPartners(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    return this.partnerService.getAllPartners(
      query.limit,
      query.page,
      user.id,
      body,
    );
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getPartner(@Param('id') id: number) {
    return this.partnerService.getSinglePartner(id);
  }

  @Patch('/:id')
  async updatePartner(
    @Param('id') id: string,
    @Body() updatePartnerDTO: UpdatePartnerDTO,
    @GetUser() user: User,
  ) {
    return this.partnerService.updatePartner(+id, updatePartnerDTO, user.id);
  }

  @Get(':id/tasks')
  @HttpCode(HttpStatus.OK)
  async getPartnerTasks(@Param('id') id: number, @Query() query: GetTaskQuery) {
    return this.tasksService.findByEntity(id, query, TaskEntityType.PARTNER);
  }

  @Put('update-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req,
  ) {
    return this.partnerService.updatePassword(+id, updatePasswordDto, req.user);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deletePartner(@Param('id') id: string) {
    await this.partnerService.deletePartner(+id);
    return { message: 'Partner deleted successfully' };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('notes')
  @HttpCode(HttpStatus.OK)
  async createNotes(
    @Body() createKycNoteDto: CreateKycNoteDto,
    @Request() req: any,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const createdBy = req.user.id;
    await this.adminKycService.createNote(createKycNoteDto, createdBy);
    const isSuccess = i18n?.t('success.client.noteCreated');
    return { success: true, message: isSuccess };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('notes/:id')
  @HttpCode(HttpStatus.OK)
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKycNoteDto: UpdateKycNoteDto,
    @Request() req: any,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const createdBy = req.user.id;
    await this.adminKycService.updateKycNote(id, updateKycNoteDto, createdBy);
    const isSuccess = i18n?.t('success.client.noteUpdated');
    return { success: true, message: isSuccess };
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id/notes')
  async getKycNotes(
    @Param('id') id: number,
    @Query() getKycNotesDto: GetKycNotesDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<notes[]> {
    const { page, limit } = paginationDto;
    const documentId = getKycNotesDto.documentId;
    const type = getKycNotesDto.type;
    const paginationOptions = paginationDto ? { page, limit } : undefined;

    const data = await this.adminKycService.getKycNotesWithPartner(
      id,
      type,
      documentId,
      paginationOptions,
    );

    return data;
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete('notes/:id')
  async softDeleteKycNote(@Param('id') id: number, @GetUser() user: User,): Promise<any> {
    const i18n = I18nContext.current();
    await this.adminKycService.softDeleteKycNote(id, user.id);
    const isSuccess = i18n?.t('success.client.noteDeleted');
    return { success: true, message: isSuccess };
  }

  @Get('list-single-url/:id')
  async getPartnerLinkById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.partnerService.getPartnerLinkById(id);
  }

  @Get('/:id/configuration')
  async getPartnerConfigById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.partnerService.getPartnerConfigById(id);
  }

  @Post('generate-link')
  @HttpCode(HttpStatus.OK)
  async generatePartnerLink(
    @Request() req,
    @Body() generatePartnerLinkDto: GeneratePartnerLinkDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.partnerService.generatePartnerLink(
      req.headers,
      generatePartnerLinkDto,
      user.id,
    );
  }

  @Post('add-link')
  @HttpCode(HttpStatus.OK)
  async addLink(@Body() createPartnerLinkDto: CreatePartnerLinkDto) {
    return this.partnerService.createPartnerLink(createPartnerLinkDto);
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

  @Post('create-ib/:id')
  @HttpCode(HttpStatus.OK)
  async createIb(@Param('id', ParseIntPipe) id: number) {
    return this.partnerService.createIb(id);
  }

  @Delete('delete-link/:id')
  @HttpCode(HttpStatus.OK)
  async deletePartnerLink(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.partnerService.deletePartnerLink(id);
  }

  @Patch('update-link-url/:id')
  @HttpCode(HttpStatus.OK)
  async updatePartnerLinkUrl(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePartnerLinkUrlDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.partnerService.updatePartnerLinkUrl(id, dto, user.id);
  }

  @Delete('soft-delete-link/:id')
  @HttpCode(HttpStatus.OK)
  async softDeletePartnerLink(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<any> {
    return this.partnerService.softDeletePartnerLink(id, user.id);
  }

  @Get('partners-by-level/:level')
  @ApiOperation({ summary: 'Get partners by level' })
  @ApiResponse({ status: 200, description: 'Partners fetched successfully' })
  @ApiResponse({ status: 400, description: 'Partner not found' })
  @HttpCode(HttpStatus.OK)
  async getPartnersByLevel(@Param('level', ParseIntPipe) level: number) {
    const data = await this.partnerService.getPartnersByLevel(level);
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Partners fetched successfully',
      data,
    });
  }

  @Get(':id/mt5-accounts')
  @HttpCode(HttpStatus.OK)
  async getPartnerMt5Accounts(@Param('id', ParseIntPipe) id: number) {
    const data = await this.partnerService.getPartnerMt5Accounts(id);
    return {
      status: 0,
      statusCode: 200,
      statusText: 'Partner MT5 accounts fetched successfully',
      data
    };
  }
}
