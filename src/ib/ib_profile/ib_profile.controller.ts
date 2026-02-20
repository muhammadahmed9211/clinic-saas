import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IbProfileService } from './ib_profile.service';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IbProfileCreateDto, UpdateIbProfileDto } from './dto/ib_profile.dto';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('IB Profile')
@Controller({ path: 'admin/ib-profile', version: '1' })
export class IbProfileController {
  constructor(private readonly ibProfileService: IbProfileService) { }

  @Post()
  async create(
    @Body() createIbProfileDto: IbProfileCreateDto,
    @GetUser() user: User,
  ) {
    const data = await this.ibProfileService.create(
      createIbProfileDto,
      user.id,
    );
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB Commission Profile created successfully',
      data,
    });
  }

  @Post('list')
  async getAllIbProfiles(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    const { limit = 10, page = 1 } = query;
    return this.ibProfileService.getIbProfileList({
      userId,
      limit,
      page,
      dto: body,
    });
  }

  @Get('commission-profile-types')
  async getAllCommissionProfileTypes() {
    const data = await this.ibProfileService.findAllCommissionProfileTypes();
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB commission profile types fetched successfully',
      data,
    });
  }

  @Get('commission-profile')
  async getCommisonProfileForIb(@GetUser() user: User) {
    const data = await this.ibProfileService.getCommisonProfileForUser(user.id);
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB commission profile types fetched successfully',
      data,
    });
  }

  @Get('user-commission-profile/:id')
  async getUserIbCommissionProfile(@Param("id") userId: number) {
    const data = await this.ibProfileService.getUserPartnerCommssionProfile(userId);
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Commission profile for user fetched successfully',
      data,
    });
  }

  @Get('profile-type/:id/distributions')
  async getDistributionsByProfileType(@Param('id') id: number) {
    const data = await this.ibProfileService.findDistributionsByProfileType(id);
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Distributions for profile type fetched successfully',
      data,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.ibProfileService.findOne(id);
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB Commission Profile fetch successfully',
      data,
    });
  }

  @Get()
  async findAll() {
    const data = await this.ibProfileService.findAll();
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB Commission Profile fetched successfully',
      data,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateIbProfileDto: UpdateIbProfileDto,
    @GetUser() user: User,
  ) {
    const data = await this.ibProfileService.update(id, updateIbProfileDto, user.id);
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB profile update successfully',
      data,
    });
  }

  @Delete('config/:id')
  async deleteConfig(@Param('id') id: number, @GetUser() user: User) {
    const data = await this.ibProfileService.deleteConfig(id, user.id);
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB profile config delete successfully',
      data,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @GetUser() user: User) {
    const data = await this.ibProfileService.delete(id, user.id);
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB profile delete successfully',
      data,
    });
  }

  @Get('level/:level')
  @ApiOperation({ summary: 'Get IB Commission Profiles by level' })
  @ApiParam({ name: 'level', description: 'Level to filter by', type: 'number' })
  @ApiResponse({ status: 200, description: 'Returns profiles matching the specified level' })
  async getProfilesByLevel(@Param('level') level: number) {
    const data = await this.ibProfileService.findProfilesByLevel(level);
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB Commission Profiles by level fetched successfully',
      data,
    });
  }
}
