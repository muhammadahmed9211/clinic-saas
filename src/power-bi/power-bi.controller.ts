import { Controller, Get, Param } from '@nestjs/common';
import { PowerBiService } from './power-bi.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetReportToken } from './dto/get-power-bi-report-token.dto';

@ApiBearerAuth()
@ApiTags('Power BI')
@Controller({
  path: 'power-bi',
  version: '1',
})
export class PowerBiController {
  constructor(private readonly powerBiService: PowerBiService) {}

  @Get('dashboard/:dashboardId/tile:tileId')
  findAll(@Param() dto: GetReportToken) {
    return this.powerBiService.getReportToken(dto);
  }
}
