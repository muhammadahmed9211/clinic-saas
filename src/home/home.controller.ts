import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

import { LeadsRepository } from 'src/admin/leads/repositories/lead.repository';
import { HomeService } from './home.service';
import { SignalsQueryDto } from './dto/signals.query.dto';
import { IbProfileService } from 'src/ib/ib_profile/ib_profile.service';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';

@ApiTags('Home')
@Controller()
export class HomeController {
  private readonly _token = 'zwwgdbtifoabjmwcnxsaitwavgpoitse';

  constructor(
    private service: HomeService,
    private readonly leadRepository: LeadsRepository,
    private readonly ibProfileService: IbProfileService,
  ) {}

  @Get()
  appInfo() {
    return this.service.appInfo();
  }

  @Get('v1/info')
  getInfo() {
    return this.service.getInfo();
  }

  @Get('v1/signals/:term')
  @ApiHeader({
    name: 'x_custom_lang',
    required: false,
    description: 'Language code for localization (e.g., en, ar)',
    example: 'en',
  })
  getSignals(
    @Query() dto: SignalsQueryDto,
    @Param('term') term: string,
    @Headers('x_custom_lang') lang: string,
  ) {
    return this.service.fetchSignalsAsJson(dto, term, lang);
  }

  @Get('/forex-raffe-draw')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getForexRaffeDrawLeads(@Req() request: any): Promise<any> {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || token !== this._token) {
      throw new UnauthorizedException('Invalid Bearer token');
    }

    const result = await this.leadRepository.find({
      where: { utmContent: 'Raffe_Draw', isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      order: {
        id: 'DESC',
      },
    });

    const leads = result.map(({ id, firstName, lastName }) => {
      const fullName = `${firstName} ${lastName}`;
      return {
        fullName,
        id,
        leadId: id,
      };
    });
    return leads;
  }

  @Get('/forex-raffe-draw-funded')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getForexRaffeDrawLeadsFunded(@Req() request: any): Promise<any> {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || token !== this._token) {
      throw new UnauthorizedException('Invalid Bearer token');
    }

    const query = `WITH CTE_ApprovedTransactions AS (
                      SELECT 
                          l.id AS leadId, 
                          CONCAT(l.firstName, ' ', l.lastName) AS fullName, 
                          ROW_NUMBER() OVER (PARTITION BY l.id ORDER BY t.createdAt ASC) AS rowNum
                      FROM 
                          lead l
                      JOIN 
                          client c ON c.leadId = l.id
                      JOIN 
                          [transaction] t ON t.userId = c.userId
                      WHERE 
                          t.status = 'APPROVED' and t.type = 'DEPOSIT' and l.utmContent = 'Raffe_Draw' and l.isActive = 1
                  )
                  SELECT 
                      leadId, 
                      fullName
                  FROM 
                      CTE_ApprovedTransactions
                  WHERE 
                      rowNum = 1
                  ORDER BY 
    				          leadId DESC`;

    return await this.leadRepository.query(query);
  }

  @Get('v1/ib-profile/level-one')
  async findAll() {
    const data = await this.ibProfileService.findAllLevelOne();
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'IB Commission Profile fetched successfully',
      data,
    });
  }
}
