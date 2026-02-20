import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';
import { NotificationDtoByUser } from 'src/admin/leads/opportunity/dto/email.dto';
import { UpdateNotificationLabelDto } from './dto/notification.dto';
import { CreateNotificationDto } from './dto/create_notification.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateNotificationDto } from './dto/update_notification.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Notifications')
@Controller({
  path: 'notification',
  version: '1',
})
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/label')
  async createNotification(
    @Body() body: CreateNotificationDto,
    @GetUser() user: User,
  ) {
    return this.notificationService.createNewNotification(body, user);
  }

  @Post('label/list')
  async getAllLeads(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.notificationService.getNotificationList({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @Get()
  getNotifications(@Query() query: NotificationDtoByUser) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    return this.notificationService.getNotifications(page, limit);
  }

  @Get('blogs')
  getBlogs() {
    return this.notificationService.getBlogs();
  }

  @Get(':id/label')
  getOneNotification(@Param('id') id: number) {
    return this.notificationService.getNotificationById(id);
  }

  @Patch(':id/mark-as-read')
  async markNotificationAsRead(@Param('id') id: number): Promise<any> {
    await this.notificationService.markNotificationAsRead(id);
    return {
      success: true,
      message: 'Notification marked as read successfully',
    };
  }

  @Patch(':id/update-label')
  async updateNotificationLabel(
    @Param('id') id: number,
    @Body() dto: UpdateNotificationLabelDto,
  ): Promise<any> {
    await this.notificationService.updateNotificationLabel(id, dto);
    return {
      success: true,
      message: 'Notification updated successfully',
    };
  }

  @Patch(':id/label/update')
  async updateNotification(
    @Param('id') id: number,
    @Body() body: UpdateNotificationDto,
    @GetUser() user: User,
  ): Promise<any> {
    return await this.notificationService.updateNotification(id, body, user);
  }

  @ApiHeaders([
    { name: 'x_custom_lang', schema: { type: 'string', default: 'en' } },
  ])
  @Get('client')
  async getNotificationsByUserId(
    @Request() req: any,
    @Query() query: NotificationDtoByUser,
  ): Promise<Notification[]> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    const only_unread = query.only_unread;
    if (limit > 50) {
      limit = 50;
    }
    const id = req.user.id;
    return this.notificationService.getNotificationsByUserId(
      {
        paginationOptions: {
          page,
          limit,
        },
      },
      id,
      only_unread,
    );
  }

  @Delete(':id/label')
  async deleteNotification(@Param('id') id: number, @GetUser() user: User): Promise<any> {
    await this.notificationService.deleteNotification(id, user.id);
    return {
      success: true,
      message: 'Notification deleted successfully',
    };
  }
}
