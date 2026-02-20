import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AutomationConfigService } from './automation-config.service';
import { AutomationConfig } from './entities/automation-config.entity';
import { CreateAutomationConfigDto } from './dto/create-automation-config.dto';
import { UpdateAutomationConfigDto } from './dto/update-automation-config.dto';
import { QueryLogsDto } from './dto/update-automation-config.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Automation Config')
@Controller({ path: 'admin/automation-config', version: '1' })
export class AutomationConfigController {
  constructor(
    private readonly automationConfigService: AutomationConfigService,
  ) {}

  @Get()
  async findAll(): Promise<AutomationConfig[]> {
    return this.automationConfigService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AutomationConfig | null> {
    return this.automationConfigService.findOne(+id);
  }

  @Post()
  async create(
    @Body() createDto: CreateAutomationConfigDto,
    @GetUser() user: User,
  ): Promise<AutomationConfig> {
    return this.automationConfigService.create(createDto, user.id);
  }

  @Post('list')
  async getConfigList(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.automationConfigService.getConfigList({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAutomationConfigDto,
    @GetUser() user: User,
  ): Promise<AutomationConfig | null> {
    return this.automationConfigService.update(+id, updateDto, user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.automationConfigService.remove(+id);
  }

  // @Post(':id/execute')
  // //   @Roles('admin', 'super_admin')
  // async executeNow(
  //   @Param('id') id: string,
  // ): Promise<{ message: string; processed: number; errors: number }> {
  //   const result = await this.automationConfigService.executeNow(+id);
  //   return {
  //     message: 'Automation execution triggered',
  //     processed: result.processed,
  //     errors: result.errors,
  //   };
  // }

  // @Get('logs')
  // //   @Roles('admin', 'super_admin')
  // async findLogs(
  //   @Query() queryDto: QueryLogsDto,
  //   @Query('limit') limit?: number,
  //   @Query('offset') offset?: number,
  // ): Promise<{ logs: any[]; total: number }> {
  //   return this.automationConfigService.findLogs(
  //     queryDto.entityType,
  //     queryDto.entityId ? +queryDto.entityId : undefined,
  //     queryDto.automationCode,
  //     limit ? +limit : undefined,
  //     offset ? +offset : undefined,
  //   );
  // }
}
