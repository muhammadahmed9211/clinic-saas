import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query, Request } from '@nestjs/common';
import { BlockCountriesDto, CreateRegulationDto, UnBlockCountriesDto, UpdateRegulationDto } from './dto/regulations.dto';
import { RegulationService } from './regulations.service';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorator/password.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Admin Regulations')
@Controller({
  path: 'admin/regulations',
  version: '1',
})
@Controller('regulations')
export class RegulationController {
  constructor(private readonly regulationService: RegulationService) { }

  @Post()
  create(
    @Body() createRegulationDto: CreateRegulationDto,
    @Request() req,
  ) {

    return this.regulationService.create(createRegulationDto, req);
  }

  @Get()
  listAll() {
    return this.regulationService.listAll();
  }

  @Post('listRegulations')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @GetUser() user: User,
    @Query() query: PaginationDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ): Promise<any[]> {
    return this.regulationService.findAll(
      query.limit || 10,
      query.page || 1,
      body,
      user.id,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regulationService.findOne(+id);
  }

  @Get(':id/unban-countries')
  unbanCountries(@Param('id') id: string) {
    return this.regulationService.unbanCountries(+id);
  }

  @Post(':id/unban-countries')
  unblockCountry(@Param('id') id: string, @Body() dto: UnBlockCountriesDto) {
    return this.regulationService.unblockCountry(+id, dto.countryCode);
  }

  @Post(':id/ban-countries')
  async blockCountry(
    @Param('id') id: string,
    @Body() dto: BlockCountriesDto
  ) {
    return this.regulationService.blockCountry(+id, dto.countryCode);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegulationDto: UpdateRegulationDto,@Request() req) {
    return this.regulationService.update(+id, updateRegulationDto,req);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Request() req) {
    return this.regulationService.remove(+id,req);
  }

  @Post(':id/test-smtp')
  async testSmptpConfig(
    @Param('id') id: string,
    @Request() req,
  ) {
    const userId = req.user.id
    return this.regulationService.testSmtp(parseInt(id),userId)
  }
}

@ApiTags('countries Regulations')
@ApiHeaders([
  { name: 'x_custom_lang', schema: { type: 'string', default: 'en' } },
])
@Controller({
  path: 'regulations/',
  version: '1',
})
export class PublicRegulationController {
  constructor(private readonly regulationService: RegulationService) {}

  @Get('country/:countryIso')
  getAllowedRegulations(@Param('countryIso') countryIso: string) {
    return this.regulationService.getAllowedRegulations(countryIso);
  }
}