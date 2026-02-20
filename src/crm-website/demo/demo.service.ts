import { Injectable } from '@nestjs/common';
import { CreateDemoFormDto, DemoFormEmail, DemoFormEmailSubject } from './dto/demo.dto';
import { SendEmailService } from 'src/common/services/send-email.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class DemoService {
  constructor(
    private readonly sendEmailService: SendEmailService, 
    private readonly configService: ConfigService<AllConfigType>,
  ) {
  }

  async sendDemoRequestForm(createDemoFormDto: CreateDemoFormDto):Promise<any> {
   try {
    await this.sendEmailService.getNoReplyEmail
    await this.sendEmailService.sendEmailToOperatorWithoutVariable({
        emailEventName: DemoFormEmail.DEMO_REQUEST_FORM,
        subject: DemoFormEmailSubject.DEMO_REQUEST_FORM,
        from: this.configService.getOrThrow('mail.defaultEmail', { infer: true }),
        to: this.configService.getOrThrow('mail.crmWebsiteEmail', { infer: true }),
        manualData: createDemoFormDto
    })
    return {
        message:'Email Sent Successfully'
    }     
   } catch (error) {
      throw error
   }
  } 
}