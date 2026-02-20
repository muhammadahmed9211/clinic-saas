import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IbConfigService } from './ib_config.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateIbConfigDto, UpdateIbConfigDto } from './dto/ib_config.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { EventPatternWithPrefix } from 'src/common/decorators/event-pattern-with-prefix';
import { MT5DealData } from '../interfaces/Mt5Deal.interface';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { CommissionTopics } from 'src/kafka/topics/ib/commission.topics.enum';
import { ClientKafka } from '@nestjs/microservices';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('IB Profile Config')
@Controller({ path: 'admin/ib-config', version: '1' })
export class IbConfigController {
  constructor(
    private readonly ibConfigService: IbConfigService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create new IB profile configuration' })
  @ApiResponse({ status: 201, description: 'The IB profile configuration has been successfully created.' })
  async create(@Body() createIbConfigDto: CreateIbConfigDto, @GetUser() user: User) {
    const data = await this.ibConfigService.createConfig(createIbConfigDto, user.id);

    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 201,
      statusText: 'IB config created successfully',
      data,
    });
  }

  @Post('list')
  @ApiOperation({ summary: 'Get IB profile configuration list with pagination' })
  @ApiResponse({ status: 200, description: 'Returns IB profile configuration list with pagination' })
  async getList(
    @Query() pagination: PaginationDto,
    @Body() dto: ApplyListFilterSortColumnDto,
    @GetUser() user: User,
  ) {
    const limit = pagination.limit || 10;
    const page = pagination.page || 1;

    return await this.ibConfigService.getIbConfigList({
      userId: user.id,
      limit,
      page,
      dto,
    });

  }

  // @Get()
  // @ApiOperation({ summary: 'Get all IB profile configurations' })
  // @ApiResponse({ status: 200, description: 'Returns all IB profile configurations' })
  // async findAll() {
  //   const data = await this.ibConfigService.findAll();

  //   return ResponseWrapper.wrap({
  //     status: 0,
  //     statusCode: 200,
  //     statusText: 'IB config fetch successfully',
  //     data,
  //   });
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific IB profile configuration by ID' })
  @ApiResponse({ status: 200, description: 'Returns the IB profile configuration' })
  @ApiResponse({ status: 400, description: 'IB Config not found' })
  async findOne(@Param('id') id: number) {
    const data = await this.ibConfigService.findOne(id);

    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB config fetch successfully',
      data,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an IB profile configuration' })
  @ApiResponse({ status: 200, description: 'The IB profile configuration has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'IB Config not found' })
  async update(
    @Param('id') id: number,
    @Body() updateIbConfigDto: UpdateIbConfigDto,
    @GetUser() user: User,
  ) {
    const data = await this.ibConfigService.update(id, updateIbConfigDto, user.id);

    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB config update successfully',
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an IB profile configuration' })
  @ApiResponse({ status: 200, description: 'The IB profile configuration has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'IB Config not found' })
  async delete(@Param('id') id: number, @GetUser() user: User) {
    const data = await this.ibConfigService.delete(id, user.id);

    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB config delete successfully',
      data,
    });
  }

  @Get('/ib-hierarchy/:partnerId')
  @ApiResponse({ status: 200, description: 'Returns the IB hierarchy for the given partner' })
  async getIbHierarchyByPartnerId(@Param('partnerId') partnerId: number) {
    const data = await this.ibConfigService.getIbHierarchyByPartnerId(partnerId);
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB hierarchy fetched successfully',
      data,
    });
  }
}
