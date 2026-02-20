import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import fs from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AllConfigType } from 'src/config/config.type';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';
import { SendEmails } from 'src/kafka/topics/sendEmail/sendEmail.enum';
import { CreateEmailTemplate, SendEmail } from 'src/email/dto/mail.send.dto';
import { MarkReadDto } from 'src/users/dto/mark-read.dto';
import { ISendAgreement } from 'src/mail/interfaces/mail-data.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MailerService implements OnModuleInit {
  private readonly transporter: nodemailer.Transporter;
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly kafka: KafkaService,
    @Inject('MAIL_SERVICE') private readonly mailClient: ClientKafka,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('mail.host', { infer: true }),
      port: configService.get('mail.port', { infer: true }),
      ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
      secure: configService.get('mail.secure', { infer: true }),
      requireTLS: configService.get('mail.requireTLS', { infer: true }),
      auth: {
        user: configService.get('mail.user', { infer: true }),
        pass: configService.get('mail.password', { infer: true }),
      },
    });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get('mail.defaultName', {
            infer: true,
          })}" <${this.configService.get('mail.defaultEmail', {
            infer: true,
          })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }

  async sendEmail(emailPayload: SendEmail) {
    if(!emailPayload.skipCommunication){
      emailPayload.skipCommunication = false
    }
    const languageIso = await this.getLanguageIso(emailPayload.to);
    await this.kafka.emitMailEvent(this.mailClient, SendEmails.sendEmail, {
      ...emailPayload,
      languageIso,
    });
  }

  async sendEmailKyc(emailPayload: SendEmail) {
    await this.kafka.emitMailEvent(
      this.mailClient,
      SendEmails.sendEmailKYC,
      emailPayload,
    );
  }

  async sendEmailWithDynamicData(emailPayload: SendEmail) {
    await this.kafka.emitMailEvent(
      this.mailClient,
      SendEmails.sendEmailDynamic,
      emailPayload,
    );
  }

  async sendEmailViaHtml(emailPayload: any) {
    await this.kafka.emitMailEvent(
      this.mailClient,
      SendEmails.sendEmailViaHtml,
      emailPayload,
    );
  }

  async sendLeadEmailViaHtml(emailPayload: any) {
    await this.kafka.emitMailEvent(
      this.mailClient,
      SendEmails.sendLeadEmailViaHtml,
      emailPayload,
    );
  }

  async updateDraftEmailViaHtml(draftEmailPayload: any) {
    await this.kafka.emitMailEvent(
      this.mailClient,
      SendEmails.updateDraftEmailViaHtml,
      draftEmailPayload,
    );
  }

  //saving data into communication table of mailMicroService
  async sendCommunication(emailPayload: any) {
    await this.kafka.emitMailEvent(
      this.mailClient,
      SendEmails.sendCommunication,
      emailPayload,
    );
  }

  async updateCommunication(emailPayload: any) {
    await this.kafka.emitMailEvent(
      this.mailClient,
      SendEmails.updateCommunication,
      emailPayload,
    );
  }

  async sendWeclomeMails(emailPayload: SendEmail) {
    const languageIso = await this.getLanguageIso(emailPayload.to);
    await this.kafka.emitMailEvent(
      this.mailClient,
      SendEmails.sendWeclomeMails,
      { ...emailPayload, languageIso },
    );
  }

  async sendAgreementEmails(emailPayload: ISendAgreement) {
    const languageIso = await this.getLanguageIso(emailPayload.to);
    await this.kafka.emitMailEvent(
      this.mailClient,
      SendEmails.sendAgreementEmail,
      { ...emailPayload, languageIso },
    );
  }

  async getCommunication(emailPayload: any) {
    return await this.kafka.sendMailMessage(
      this.mailClient,
      SendEmails.getAllCommunication,
      emailPayload,
    );
  }

  async getLatesCommunication(emailPayload: any) {
    return await this.kafka.sendMailMessage(
      this.mailClient,
      SendEmails.getLatestLead,
      emailPayload,
    );
  }

  async getEmailInbox(emailPayload: any) {
    return await this.kafka.sendMailMessage(
      this.mailClient,
      SendEmails.getEmailInbox,
      emailPayload,
    );
  }

  async getEmailInboxById(emailPayload: any) {
    return await this.kafka.sendMailMessage(
      this.mailClient,
      SendEmails.getEmailInboxById,
      emailPayload,
    );
  }

  async getEmailInboxByLead(emailPayload: any) {
    return await this.kafka.sendMailMessage(
      this.mailClient,
      SendEmails.getEmailInboxByLead,
      emailPayload,
    );
  }

  async getLeadCommunication(emailPayload: any) {
    return await this.kafka.sendMailMessage(
      this.mailClient,
      SendEmails.getLeadCommunication,
      emailPayload,
    );
  }

  async markMessageAsRead(emailPayload: MarkReadDto) {
    return await this.kafka.emitMailEvent(
      this.mailClient,
      SendEmails.markMessageAsRead,
      emailPayload,
    );
  }

  async onModuleInit() {
    const appEnv = this.configService.getOrThrow('app.environment', {
      infer: true,
    });
    const domain = this.configService.getOrThrow('app.domain', {
      infer: true,
    });
    for (const topic of Object.values(SendEmails)) {
      await this.mailClient.subscribeToResponseOf(
        `${appEnv}.${domain}.${topic}`,
      );
      //
    }
  }

  async getAgreements(emailPayload: any) {
    return await this.kafka.sendMailMessage(
      this.mailClient,
      SendEmails.getAllAgreements,
      emailPayload,
    );
  }
  
  async getOneMessage(payload: any) {
    return await this.kafka.sendMailMessage(
      this.mailClient,
      SendEmails.getOneMessage,
      payload,
    );
  }

  async getLanguageIso(emailTo: string | string[]) {
    const email = typeof emailTo === 'string' ? emailTo : emailTo[0];
    const client = await this.userRepository.findOne({ where: { email } });
    return client?.languageIso?.toUpperCase() || 'EN';
  }

  async getMeetingMails(emailPayload: any) {
    return await this.kafka.sendMailMessage(
      this.mailClient,
      SendEmails.sendMeetingMails,
      emailPayload,
    );
  }

  async sendOtp(emailPayload: SendEmail) {
    const languageIso = await this.getLanguageIso(emailPayload.to);
    await this.kafka.emitMailEvent(this.mailClient, SendEmails.sendOtp, {
      ...emailPayload,
      languageIso,
    });
  }

  async testSmtp(emailPayload: any) {
    return await this.kafka.sendMailMessage(this.mailClient, SendEmails.testSmtp,
    emailPayload,
    );
  }
}
