import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/password.decorator';
import {
  PaginationDto,
  PaginationDtoForSentEmail,
} from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { User } from 'src/users/entities/user.entity';
import { CommunicationService } from './communication.service';
import { I18nContext } from 'nestjs-i18n';
import { UpdateDraftEmailDto } from '../dto/update-draft-email';

@Controller({ path: 'admin/leads/communications', version: '1' })
@ApiTags('Communication')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('lead/opportunity/communication/:id')
  @HttpCode(HttpStatus.OK)
  async updateCommunicationDraft(
    @Param('id') id: string,
    @Body() updateDraftEmailDto: UpdateDraftEmailDto,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    const i18n = I18nContext.current();
    const operatorId = user.id;

    const updatedCreateCommunicationDto = {
      ...updateDraftEmailDto,
      operatorId,
    };

    await this.communicationService.updateDraftEmail(
      +id,
      updatedCreateCommunicationDto,
    );

    const isSuccess = i18n?.t('success.email.success');

    return {
      message: `${isSuccess}`,
    };
  }
  @Get('emails/stats')
  @HttpCode(HttpStatus.OK)
  async getNotesStats(@GetUser() user: User) {
    return await this.communicationService.getEmailStats(user.id);
  }

  @Post('listAll/email-inbox')
  @HttpCode(HttpStatus.OK)
  async getAllInboxEmail(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    return this.communicationService.findAllInbox(
      query.limit || 10,
      query.page || 1,
      user.id,
      body,
    );
  }

  @Post('listAll/email-sentAndDraft')
  @HttpCode(HttpStatus.OK)
  async findAllSentAndDraft(
    @GetUser() user: User,
    @Query() query: PaginationDtoForSentEmail,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    return this.communicationService.findAllSentAndDraft(
      query.limit || 10,
      query.page || 1,
      user.id,
      body,
      query.send,
    );
  }
}
