import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  SerializeOptions,
  UseGuards,
  Request,
  Post,
  Body,
  Param,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import { MasterTaskService } from './task.service';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NullableType } from 'src/utils/types/nullable.type';
import { UserTask } from './entities/user_task.entity';
import { UserTaskCompleteDto } from './dto/user_task_complete.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateTaskLabelDto } from './dto/user_task_create.dto';
import { MasterTask } from './entities/master_task.entity';
import { CreateMasterTaskDto } from './dto/master_task_create.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { UpdateMasterTaskDto } from './dto/master_task_update.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiHeaders([
  { name: 'x_custom_lang', schema: { type: 'string', default: 'en' } },
])
@ApiTags('User Tasks')
@Controller({ path: 'auth/task', version: '1' })
export class MasterTaskController {
  constructor(private readonly service: MasterTaskService) {}

  @Post()
  async createUserTask(
    @Body() body: CreateMasterTaskDto,
    @GetUser() user: User,
  ): Promise<MasterTask> {
    try {
      return await this.service.createMasterTask(body, user);
    } catch (e) {
      throw e;
    }
  }

  @Post('list')
  async getAllMasterTask(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.service.getMasterTaskList({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @Get(':id')
  async getMasterTaskById(
    @Param('id') id: number,
  ): Promise<NullableType<MasterTask>> {
    return await this.service.findOne(id);
  }

  @Get()
  async taskGetByUserId(
    @Request() request,
  ): Promise<NullableType<UserTask | any>> {
    return await this.service.findUserTask(request.user);
  }

  @Patch(':id')
  async updateMasterTask(
    @Param('id') id: number,
    @Body() body: UpdateMasterTaskDto,
    @Request() request,
  ) {
    return await this.service.updateMasterTask(id, body,request.user);
  }

  @Post('complete')
  async createTaskCompletion(
    @Request() request,
    @Body() body: UserTaskCompleteDto,
  ): Promise<NullableType<UserTask | any>> {
    return await this.service.createTaskCompleted(request.user, body);
  }

  @Post('find/task')
  async findAndCreateTask(
    @GetUser() user: User,
  ): Promise<NullableType<UserTask | any>> {
    return await this.service.findAndCreateTask(user);
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('master-all')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getMasterTask(): Promise<any> {
    return await this.service.findAll();
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch(':id/update-master-label')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateTaskLabel(
    @Param('id') id: number,
    @Body() dto: UpdateTaskLabelDto,
  ): Promise<any> {
    await this.service.updateTaskLabel(id, dto);
    return {
      success: true,
      message: 'Task updated successfully',
    };
  }

  @Delete(':id')
  async deleteMasterTask(
    @Param('id') id: number,
    @Request() request,
  ) {
    await this.service.deleteMasterTask(id,request.user);
    return {
      status: HttpStatus.OK,
      message: 'Task deleted successfully',
    };
  }
}
