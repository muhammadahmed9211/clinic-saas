import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MeetingsService } from './meetings.service';
import {
  AddParticipantsDto,
  CancelMeetingDto,
  CompleteMeetingDto,
  CreateMeetingDto,
  DeleteMeetingDto,
  DeleteParticipantsDto,
  MeetingAttachmentDto,
  MeetingAttachmentResponseDto,
  UpdateMeetingDto,
} from './dto/meetings.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';

@Controller({ path: 'admin/leads', version: '1' })
@ApiTags('Meetings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post('getMeetings')
  @HttpCode(HttpStatus.OK)
  async getAllPartners(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    return this.meetingsService.listAllMeetings(
      query.limit || 10,
      query.page || 1,
      user.id,
      body,
    );
  }

  @Get('stats/getAllMeetingsStats')
  @HttpCode(HttpStatus.OK)
  async meetingStats(@GetUser() user: User) {
    return this.meetingsService.meetingStats(user.id);
  }

  @Post(':id/meetings/createMeeting')
  @HttpCode(HttpStatus.OK)
  async createMeeting(
    @Param('id') id: number,
    // @Param('fromEmail') fromEmail: string,
    @Req() req,
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    const user = req.user;
    return this.meetingsService.createMeetings(
      id,
      user,
      createMeetingDto.fromEmail,
      createMeetingDto,
    );
  }

  @Delete(':id/meetings/:id/deleteParticipants')
  @HttpCode(HttpStatus.OK)
  async deleteParticipants(
    @Query('leadId') leadId: number,
    @Query('meetingId') meetingId: number,
    @Body() deleteParticipantsDto: DeleteParticipantsDto,
    @GetUser() user: User,
  ) {
    return this.meetingsService.deleteParticipants(
      leadId,
      meetingId,
      deleteParticipantsDto,
      user
    );
  }

  @Get(':leadId/meetings/:meetingId/listParticipants')
  @HttpCode(HttpStatus.OK)
  async listParticipants(
    @Param('leadId') leadId: number,
    @Param('meetingId') meetingId: number,
  ) {
    return this.meetingsService.listParticipants(leadId, meetingId);
  }

  @Patch(':leadId/meeting/:meetingId/updateMeeting')
  @HttpCode(HttpStatus.OK)
  async updateMeeting(
    @Param('leadId') leadId: number,
    @Param('meetingId') id: number,
    @Body() updateMeetingDto: UpdateMeetingDto,
    @GetUser() user: User,
  ) {
    return this.meetingsService.updateMeetings(leadId, id, updateMeetingDto,user.id);
  }

  @Post('rescheduleMeeting/:id')
  @HttpCode(HttpStatus.OK)
  async rescheduleMeetings(
    @Param('id') id: number,
    @Body() createMeetingDto: CreateMeetingDto,
    @GetUser() user: User,
  ) {
    return this.meetingsService.rescheduleMeeting(id, createMeetingDto,user);
  }

  @Get(':id/meetings')
  @HttpCode(HttpStatus.OK)
  async listAllleMeeting(@Param('id') id: number) {
    return this.meetingsService.getAllMeetingsByLeadId(+id);
  }

  // @Get('/id/meeting/:id')
  // @HttpCode(HttpStatus.OK)
  // async listSingleMeeting(@Param('id') id: number) {
  //   return this.meetingsService.listSingleMeeting(+id);
  // }

  @Get(':leadId/meeting/:meetingId/listSingleMeeting')
  @HttpCode(HttpStatus.OK)
  async listSingleMeeting(
    @Param('leadId') leadId: number,
    @Param('meetingId') meetingId: number,
  ) {
    return this.meetingsService.listSingleMeeting(leadId, meetingId);
  }

  // @Patch('id/meeting/complete/:id')
  // @HttpCode(HttpStatus.OK)
  // async completeMeeting(
  //   @Param('id') id: number,
  //   @Body() completeMeetingDto: CompleteMeetingDto,
  // ) {
  //   return this.meetingsService.completeMeetingById(id, completeMeetingDto);
  // }

  @Patch(':leadId/meeting/:id/completeMeeting')
  @HttpCode(HttpStatus.OK)
  async completeMeeting(
    @Param('leadId') leadId: number,
    @Param('id') id: number,
    @Body() completeMeetingDto: CompleteMeetingDto,
    @GetUser() user: User,
  ) {
    return this.meetingsService.completeMeetingById(
      leadId,
      id,
      completeMeetingDto,
      user.id
    );
  }

  @Patch(':leadId/meeting/:id/cancelMeeting')
  @HttpCode(HttpStatus.OK)
  async cancelMeeting(
    @Param('leadId') leadId: number,
    @Param('id') id: number,
    @Body() cancelMeetingDto: CancelMeetingDto,
    @GetUser() user: User,
  ) {
    return this.meetingsService.cancelMeetingById(leadId, id, cancelMeetingDto,user.id);
  }

  @Get(':id/meetings/calendar')
  @HttpCode(HttpStatus.OK)
  async listMeetingsByDateRange(
    @Param('id') id: number,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.meetingsService.listMeetingsByLeadIdAndDateRange(
      +id,
      startDate,
      endDate,
    );
  }

  @Get('meetings/calendar')
  @HttpCode(HttpStatus.OK)
  async listMeetingsCalendar(
    // @Param('id') id: number,
    @GetUser() user: User,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.meetingsService.listAllMeetings(
      10,
      1,
      user.id,
      {
        filters: [
          {
            listColumnMeta: { name: 'from' },
            operator: FilterOperation.BETWEEN,
            //@ts-expect-error date-type-issue
            values: [new Date(startDate), new Date(endDate)],
          },
          {
            listColumnMeta: { name: 'to' },
            operator: FilterOperation.BETWEEN,
            //@ts-expect-error date-type-issue
            values: [new Date(startDate), new Date(endDate)],
          },
        ],
        sort: [],
      },
      true,
    );
  }

  @Post(':leadId/meeting/:meetingId/deleteMeeting')
  @HttpCode(HttpStatus.OK)
  async deleteMeeting(
    @Param('leadId') leadId: number,
    @Param('meetingId') meetingId: number,
    @Body() deleteMeetingDto: DeleteMeetingDto,
    @GetUser() user: User,
  ) {
    return this.meetingsService.deleteMeetingById(
      leadId,
      meetingId,
      deleteMeetingDto,
      user.id
    );
  }

  @Post(':leadId/meetings/:meetingId/addParticipants')
  @HttpCode(HttpStatus.OK)
  async addParticipants(
    @Param('leadId') leadId: number,
    @Param('meetingId') meetingId: number,
    @Body() addParticipantsDto: AddParticipantsDto,
    @GetUser() user: User,
  ) {
    return this.meetingsService.addParticipants(
      leadId,
      meetingId,
      addParticipantsDto,
      user.id
    );
  }

  @Post('meeting/upload-attachment')
  async createAttachment(
    @Body() createAttachmentDto: MeetingAttachmentDto,
    @Request() req: any,
  ): Promise<any> {
    const attachedBy = req.user.id;
    return this.meetingsService.createMeetingAttachment(
      createAttachmentDto,
      attachedBy,
    );
  }

  @Get(':id/meeting/:mid/attachments')
  async getAllAttachments(
    @Param('id') id: number,
    @Param('mid') mid: number,
  ): Promise<MeetingAttachmentResponseDto[]> {
    console.log('in attachment get all');
    return this.meetingsService.getAllAttachments(+id, +mid);
  }

  @Delete('meeting/attachment/:id')
  async softDeleteAttachment(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    await this.meetingsService.softDeleteAttachment(id,user.id);
  }
}