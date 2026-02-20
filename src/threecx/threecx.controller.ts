import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ThreecxService } from './threecx.service';
import { ThreecxQuery } from './dto/query.dto';
import { Lead } from 'src/admin/leads/entities/lead.entity';

@ApiBearerAuth()
@ApiTags('ThreeCX')
@Controller({ path: 'threecx', version: '1' })
export class ThreecxController {

  constructor(
    private threecxService: ThreecxService,
  ) { }

  @Get('/contact')
  @HttpCode(HttpStatus.OK)
  async getLeadByNumber(@Query() query: ThreecxQuery, @Req() request): Promise<any> {
    const authHeader = request.headers['authorization'];

    if (authHeader?.startsWith('Basic ')) {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [apiKey] = credentials.split(':'); // 3CX only sends API key as username

      if (apiKey === process.env.THREECX_API_KEY) {
        let lead: Lead | null = null;
        if (query.number) {
          let cleaned = query.number.trim();

          if (cleaned.startsWith('00')) {
            cleaned = cleaned.slice(2);
          }
          lead = await this.threecxService.findLeadByNumber(cleaned);
        } else if (query.email) {
          lead = await this.threecxService.findLeadByEmail(query.email);
        }

        return {
          contact: {
            id: lead?.id,
            firstname: lead?.firstName,
            lastname: lead?.lastName,
            company: lead?.companyName || 'N/A',
            email: lead?.email,
            phone: lead?.phoneNumber || '',
            mobilephone: lead?.phoneNumber || '',
            url: `${process.env.CRM_FRONT_END_URL}/lead/${lead?.id}`,
            customvalue: 'custom_field_value' // optional
          },
        };
      } else {
        throw new UnauthorizedException('Invalid API Key');
      }
    }
  }

  @Post('/call-log')
  @HttpCode(HttpStatus.OK)
  async createCallLog(@Body() body: any, @Req() request) {
    console.log('3cx /call-log, body------->', body);

    const authHeader = request.headers['authorization'];

    if (authHeader?.startsWith('Basic ')) {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [apiKey] = credentials.split(':'); // 3CX only sends API key as username

      if (apiKey === process.env.THREECX_API_KEY) {
        const lead = await this.threecxService.findLeadById(body.contactId);
        if (!lead) {
          throw new NotFoundException('Lead not found');
        }
        this.threecxService.createCallLogs(body, lead);
        return { success: true };
      } else {
        throw new UnauthorizedException('Invalid API Key');
      }
    }
  }
}
