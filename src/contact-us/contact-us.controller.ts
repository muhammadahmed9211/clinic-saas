import { Controller, Get, Req, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiHeaders, ApiBearerAuth } from '@nestjs/swagger';
import { ContactUsService } from './contact-us.service';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Contact Us')
@Controller({ path: 'contact-us', version: '1' })
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @ApiHeaders([{ name: 'x_custom_lang', schema: { default: 'en' } }])
  @Get()
  async getContactUs(@Req() req: any) {
    try {
      const language = (req.headers['x_custom_lang'] || 'en').toLowerCase();
      const result = await this.contactUsService.getContactPage(language);

      if (!result) {
        return {
          status: 1,
          statusCode: 404,
          message: 'Contact page not found',
          result: null,
        };
      }

      return {
        status: 0,
        statusCode: 200,
        message: 'OK',
        result,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch contact page');
    }
  }
}
