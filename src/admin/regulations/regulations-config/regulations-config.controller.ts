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
  Query,
  UseGuards,
} from '@nestjs/common';
import { RegulationsConfigService } from './regulations-config.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateRegulationRuleDto,
  CreateRegulationEventDto,
} from './dto/create-regulation-config.dto';
import {
  UpdateRegulationEventDto,
  UpdateRegulationRuleDto,
} from './dto/update-regulation-config.dto';
import { CreateRegulationEventRuleMappingDto } from './dto/create-regulation-mapping.dto';
import { UpdateRegulationEventRuleMappingDto } from './dto/update-regulation-mapping.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Regulations Config')
@Controller({ version: '1', path: 'admin/regulations-config' })
export class RegulationsConfigController {
  constructor(
    private readonly regulationsConfigService: RegulationsConfigService,
  ) {}

  @Post('event')
  async createEvent(@Body() group: CreateRegulationEventDto, @GetUser() user: User) {
    return await this.regulationsConfigService.createEvent(group, user.id);
  }

  @Post('rule')
  async createRule(@Body() config: CreateRegulationRuleDto, @GetUser() user: User) {
    return await this.regulationsConfigService.createConfig(config, user.id);
  }

  @Post('regulation-mapping')
  async createRegulationMapping(
    @Body() body: CreateRegulationEventRuleMappingDto,
    @GetUser() user: User
  ) {
    return await this.regulationsConfigService.createRegulationMapping(body,user.id);
  }

  @Post('event-all')
  @HttpCode(HttpStatus.OK)
  async GetAllGroup(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ): Promise<any[]> {
    return this.regulationsConfigService.GetAllEvent(
      query.limit || 10,
      query.page || 1,
      body,
      user.id,
    );
  }

  @Post('rule-all')
  @HttpCode(HttpStatus.OK)
  async GetAllConfig(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ): Promise<any[]> {
    return this.regulationsConfigService.GetAllConfig(
      query.limit || 10,
      query.page || 1,
      body,
      user.id,
    );
  }

  @Get('event')
  @HttpCode(HttpStatus.OK)
  async AllGroups(): Promise<any[]> {
    return this.regulationsConfigService.AllEvents();
  }

  @Get('rule')
  @HttpCode(HttpStatus.OK)
  async AllRule(): Promise<any[]> {
    return this.regulationsConfigService.AllConfig();
  }


  @Get('event/:id')
  async GetGroupById(@Param('id') id: number) {
    return await this.regulationsConfigService.GetAllEventById(id);
  }

  @Get('rule/:id')
  async GetConfigById(@Param('id') id: number) {
    return await this.regulationsConfigService.GetAllConfigById(id);
  }

  @Get('regulation-mapping/regulation/:id')
  async getRegulationMappingById(@Param('id') id: number) {
    return await this.regulationsConfigService.GetEventByRegulationId(id);
  }

  @Patch('event/:id')
  async updateGroupById(
    @Param('id') id: number,
    @Body() body: UpdateRegulationEventDto,
    @GetUser() user: User,
  ) {
    return await this.regulationsConfigService.updateEventById(id, body,user.id);
  }

  @Patch('rule/:id')
  async updateConfigById(
    @Param('id') id: number,
    @Body() body: UpdateRegulationRuleDto,
    @GetUser() user: User,
  ) {
    return await this.regulationsConfigService.updateRuleById(id, body,user.id);
  }

  @Patch('regulation-mapping/:id')
  async updateRegulationMappingById(
    @Param('id') id: number,
    @Body() body: UpdateRegulationEventRuleMappingDto,
    @GetUser() user: User,
  ) {
    return await this.regulationsConfigService.updateEventByRegulationId(
      id,
      body,
      user.id
    );
  }

  @Delete('event/:id')
  async deleteGroupById(@Param('id') id: number,@GetUser() user: User) {
    return await this.regulationsConfigService.deleteEventById(id,user.id);
  }

  @Delete('rule/:id')
  async deleteConfigById(@Param('id') id: number,@GetUser() user: User) {
    return await this.regulationsConfigService.deleteRuleById(id,user.id);
  }
  @Delete('regulation-mapping/:id')
  async deleteRegulationMappingById(@Param('id') id: number, @GetUser() user: User) {
    return await this.regulationsConfigService.deleteRegulationMappingById(id,user.id);
  }

  @Post('regulation-mapping-list')
  @HttpCode(HttpStatus.OK)
  async GetAllRegulationMapping(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ): Promise<any[]> {
    return this.regulationsConfigService.GetAllRegulationMapping(
      query.limit || 10,
      query.page || 1,
      body,
      user.id,
    );
  }
}
