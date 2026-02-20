import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import {
  IAccountCreationRequestMail,
  ISendWelcomeMail,
  MailData,
} from './interfaces/mail-data.interface';
import { AllConfigType } from 'src/config/config.type';
import { MaybeType } from '../utils/types/maybe.type';
import { MailerService } from '../mailer/mailer.service';
import path from 'path';
import { MailSenderType } from 'src/email/dto/mail.send.dto';
import { MailTemplateIds } from 'src/utils/enums/email/templates.enum';
import { ChangeLeverageDto } from 'src/trading/dto/leverage-change.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle, text1, text2, text3] = await Promise.all([
        i18n.t('common.confirmEmail'),
        i18n.t('confirm-email.text1'),
        i18n.t('confirm-email.text2'),
        i18n.t('confirm-email.text3'),
      ]);
    }

    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      }) + '/confirm-email',
    );
    url.searchParams.set('hash', mailData.data.hash);

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'activation.hbs',
      ),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get('app.name', { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }

  async forgotPassword(
    mailData: MailData<{
      hash: string;
      url: URL;
      userId: number;
      otp:string;
      regulation?: string;
      regulationId?: number;
    }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let resetPasswordTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    let text4: MaybeType<string>;

    if (i18n) {
      [resetPasswordTitle, text1, text2, text3, text4] = await Promise.all([
        i18n.t('reset-password.resetPassword'),
        i18n.t('reset-password.text1'),
        i18n.t('reset-password.text2'),
        i18n.t('reset-password.text3'),
        i18n.t('reset-password.text4'),
      ]);
    }
    const templateName = this.configService
      .getOrThrow('mail.mailTemplates', {
        infer: true,
      })
      .find((x) => x === MailTemplateIds.FORGOT_PASSWORD);

    // const url = new URL(
    //   this.configService.getOrThrow('app.frontendDomain', {
    //     infer: true,
    //   }) + '/reset-password',
    // );
    mailData.data.url.searchParams.set('hash', mailData.data.hash);

    await this.mailerService.sendEmail({
      from: MailSenderType.NO_REPLY,
      to: mailData.to,
      subject: resetPasswordTitle,
      context: {
        title: resetPasswordTitle,
        url: mailData.data.url.toString(),
        otp: mailData.data.otp.toString(),
        actionTitle: resetPasswordTitle,
        app_name: 'Reset Password',
        text1,
        text2,
        text3,
        text4,
      },
      templateName,
      userId: mailData.data.userId,
      regulation: mailData.data.regulation,
      regulationId: mailData?.data?.regulationId,
    });
  }

  async sendOtpViaEmail(
    mailData: MailData<{
      otp: string;
      userId?: number;
      regulation?: string;
      regulationId?: number;
    }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let otpEmailTitle: MaybeType<string>;

    if (i18n) {
      [otpEmailTitle] = await Promise.all([i18n.t('common.otpEmailTitle')]);
    }

    // await this.mailerService.sendMail({
    //   to: mailData.to,
    //   subject: otpEmailTitle,
    //   text: `${mailData.data.otp}`,
    //   templatePath: path.join(
    //     this.configService.getOrThrow('app.workingDirectory', {
    //       infer: true,
    //     }),
    //     'mail-templates',
    //     'email_otp_template.hbs',
    //   ),
    //   context: {
    //     title: otpEmailTitle,
    //     actionTitle: otpEmailTitle,
    //     app_name: this.configService.get('app.name', {
    //       infer: true,
    //     }),
    //     otp: mailData.data.otp,
    //   },
    // });

    const templateName = this.configService
      .getOrThrow('mail.mailTemplates', {
        infer: true,
      })
      .find((x) => x === MailTemplateIds.SEND_OTP);

    await this.mailerService.sendOtp({
      from: MailSenderType.NO_REPLY,
      to: mailData.to,
      subject: otpEmailTitle,
      context: {
        title: otpEmailTitle,
        actionTitle: otpEmailTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        otp: mailData.data.otp,
      },
      templateName: templateName,
      userId: mailData.data.userId,
      regulation: mailData.data.regulation,
      regulationId: mailData?.data?.regulationId,
    });
  }

  //sending email to client via mailMicroService
  async sendTextViaEmail(
    mailData: MailData<{
      text: string;
      html?: string;
      subject: string;
      userId?: number;
      operatorId: number;
      languageIso?: string;
      skipCommunication?:boolean
    }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let textEmailTitle: MaybeType<string>;
    if (i18n) {
      [textEmailTitle] = await Promise.all([
        i18n.t('common.communicationEmailTitle'),
      ]);
    }
    //
    const templateName = this.configService
      .getOrThrow('mail.mailTemplates', {
        infer: true,
      })
      .find((x) => x === MailTemplateIds.SEND_TEXT);

    await this.mailerService.sendEmail({
      from: MailSenderType.NO_REPLY,
      to: mailData.to,
      cc: mailData?.cc,
      skipCommunication:mailData?.data?.skipCommunication,
      subject: mailData.data.subject,
      context: {
        title: textEmailTitle,
        actionTitle: textEmailTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        text: mailData.data.text,
      },
      templateName,
      userId: mailData.data.userId,
      operatorId: mailData.data.operatorId,
      type: 'email',
      languageIso: mailData.data.languageIso,
    });
  }

  async sendAssignmentViaEmail(
    mailData: MailData<{
      leadId: any;
      firstName: string;
      lastName: string;
      leadEmail: string;
      link: string;
      rep?: string;
      html?: string;
      subject: string;
      userId?: number;
      operatorId: number;
      languageIso?: string;
    }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let textEmailTitle: MaybeType<string>;
    if (i18n) {
      [textEmailTitle] = await Promise.all([
        i18n.t('common.communicationEmailTitle'),
      ]);
    }

    await this.mailerService.sendEmail({
      from: MailSenderType.NO_REPLY,
      to: mailData.to,
      cc: mailData?.cc,
      subject: mailData.data.subject,
      context: {
        title: textEmailTitle,
        actionTitle: textEmailTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        leadId: mailData.data.leadId,
        firstName: mailData.data.firstName,
        lastName: mailData.data.lastName,
        leadEmail: mailData.data.leadEmail,
        rep: mailData.data.rep,
        link: mailData.data.link,
      },
      templateName: MailTemplateIds.SEND_LEAD_ASSIGNMENT_EMAIL,
      userId: mailData.data.userId,
      operatorId: mailData.data.operatorId,
      type: 'email',
      languageIso: mailData.data.languageIso,
    });
  }

  async sendClientAssignmentViaEmail(
    mailData: MailData<{
      clientId: any;
      firstName: string;
      lastName: string;
      clientEmail: string;
      rep?: string;
      link: string;
      html?: string;
      subject: string;
      userId?: number;
      operatorId: number;
      languageIso?: string;
    }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let textEmailTitle: MaybeType<string>;
    if (i18n) {
      [textEmailTitle] = await Promise.all([
        i18n.t('common.communicationEmailTitle'),
      ]);
    }

    await this.mailerService.sendEmail({
      from: MailSenderType.NO_REPLY,
      to: mailData.to,
      cc: mailData?.cc,
      subject: mailData.data.subject,
      context: {
        title: textEmailTitle,
        actionTitle: textEmailTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        clientId: mailData.data.clientId,
        firstName: mailData.data.firstName,
        lastName: mailData.data.lastName,
        clientEmail: mailData.data.clientEmail,
        rep: mailData.data.rep,
        link: mailData.data.link,
      },
      templateName: MailTemplateIds.SEND_CLIENT_ASSIGNMENT_EMAIL,
      userId: mailData.data.userId,
      operatorId: mailData.data.operatorId,
      type: 'email',
      languageIso: mailData.data.languageIso,
    });
  }

  async sendHtmlViaEmail(
    mailData: MailData<{
      text?: string;
      from?: string;
      html?: string;
      subject: string;
      userId: number;
      operatorId: number;
      regulation?: string;
      regulationId?: number;
      cc?: string | string[] | null
      bcc?: string | string[] | null
      fileUuids?: string[]
      isTicket?:boolean
      ticketReplyId?:number
      ticketId?:number
      previousMessageId?:any
      references?:any[]
    }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let textEmailTitle: MaybeType<string>;

    if (i18n) {
      [textEmailTitle] = await Promise.all([
        i18n.t('common.communicationEmailTitle'),
      ]);
    }
    await this.mailerService.sendEmailViaHtml({
      from: mailData.from,
      to: mailData.to,
      subject: mailData.data.subject,
      context: {
        title: textEmailTitle,
        actionTitle: textEmailTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
      },
      html: mailData.data.html,
      userId: mailData.data.userId,
      operatorId: mailData.data.operatorId,
      type: 'email',
      regulation: mailData.data.regulation,
      regulationId: mailData?.data?.regulationId,
      cc: mailData.data.cc,
      bcc: mailData.data.bcc,
      fileUuids: mailData.data.fileUuids,
      isTicket: mailData.data.isTicket,
      ticketReplyId:mailData.data.ticketReplyId,
      ticketId: mailData.data.ticketId,
      previousMessageId: mailData.data.previousMessageId,
      references: mailData.data.references
    });
  }

  async sendLeadHtmlViaEmail(
    mailData: MailData<{
      html?: string;
      from?: string;
      subject: string;
      leadId: number;
      opportunityId?: number | null;
      operatorId: number;
      send?: boolean;
      id?: number;
      regulation?: string;
      regulationId?: number;
    }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let textEmailTitle: MaybeType<string>;

    if (i18n) {
      [textEmailTitle] = await Promise.all([
        i18n.t('common.communicationEmailTitle'),
      ]);
    }
    await this.mailerService.sendLeadEmailViaHtml({
      from: mailData.data.from,
      to: mailData.to,
      subject: mailData.data.subject,
      context: {
        title: textEmailTitle,
        actionTitle: textEmailTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
      },
      html: mailData.data.html,
      leadId: mailData.data.leadId,
      opportunityId: mailData.data.opportunityId ?? null,
      operatorId: mailData.data.operatorId,
      type: 'email',
      send: mailData.data.send,
      id: mailData.data?.id,
      regulation: mailData.data?.regulation,
      regulationId: mailData.data?.regulationId,
    });
  }

  async updateDraftHtmlEmail(
    mailData: MailData<{
      html?: string;
      from?: string;
      subject: string;
      leadId: number;
      opportunityId?: number | null;
      operatorId: number;
      id: number;
    }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let textEmailTitle: MaybeType<string>;

    if (i18n) {
      [textEmailTitle] = await Promise.all([
        i18n.t('common.communicationEmailTitle'),
      ]);
    }
    await this.mailerService.updateDraftEmailViaHtml({
      from: mailData.data.from,
      to: mailData.to,
      subject: mailData.data.subject,
      context: {
        title: textEmailTitle,
        actionTitle: textEmailTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
      },
      html: mailData.data.html,
      leadId: mailData.data.leadId,
      opportunityId: mailData.data.opportunityId ?? null,
      operatorId: mailData.data.operatorId,
      type: 'email',
      id: mailData.data.id,
    });
  }

  async sendPassword(mailData: MailData<{ password: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let passwordTitle: MaybeType<string>;

    if (i18n) {
      [passwordTitle] = await Promise.all([i18n.t('common.passwordTitle')]);
    }

    const templateName = this.configService
      .getOrThrow('mail.mailTemplates', {
        infer: true,
      })
      .find((x) => x === MailTemplateIds.REGISTER_PASSWORD);

    await this.mailerService.sendEmail({
      from: MailSenderType.NO_REPLY,
      to: mailData.to,
      subject: passwordTitle,
      context: {
        title: passwordTitle,
        actionTitle: passwordTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        password: mailData.data.password,
      },
      templateName,
    });
  }

  async leverageChange(mailData: ChangeLeverageDto): Promise<void> {
    const i18n = I18nContext.current();
    let leverageTitle: MaybeType<string>;

    //

    if (i18n) {
      [leverageTitle] = await Promise.all([i18n.t('common.leverageTitle')]);
    }

    const templateName = this.configService
      .getOrThrow('mail.mailTemplates', {
        infer: true,
      })
      .find((x) => x === MailTemplateIds.LEVERAGE_CHANGE);

    const supportEmail = this.configService.getOrThrow('mail.supportEmail', {
      infer: true,
    });

    await this.mailerService.sendEmail({
      from: MailSenderType.NO_REPLY,
      to: supportEmail,
      subject: leverageTitle,
      context: {
        title: leverageTitle,
        actionTitle: leverageTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        name: mailData.name,
        email: mailData.email,
        leverage: mailData.leverage,
        tradingAccount: mailData.accountId,
        referenceId: mailData.referenceId,
      },
      templateName,
      userId: mailData.userId,
      regulation: mailData.regulation,
      regulationId: mailData.regulationId,
    });
  }

  async accountCreationRequest(mailData: IAccountCreationRequestMail) {
    const i18n = I18nContext.current();
    let title: MaybeType<string>;

    if (i18n) {
      [title] = await Promise.all([i18n.t('common.tradingAccountRequest')]);
    }

    const templateName = this.configService
      .getOrThrow('mail.mailTemplates', {
        infer: true,
      })
      .find((x) => x === MailTemplateIds.MT5_ACCOUNT);

    //

    if (templateName) {
      await this.mailerService.sendEmail({
        from: MailSenderType.NO_REPLY,
        to: mailData.to,
        subject: title,
        context: {
          title: title,
          actionTitle: title,
          app_name: this.configService.get('app.name', {
            infer: true,
          }),
          ...mailData.context,
        },
        templateName,
      });
    }
  }

  async sendWelcomeEmails(mailData: ISendWelcomeMail) {
    const i18n = I18nContext.current();
    let welcomeSubject: MaybeType<string>;

    if (i18n) {
      [welcomeSubject] = await Promise.all([i18n.t('common.welcomeSubject')]);
    }

    await this.mailerService.sendWeclomeMails({
      from: MailSenderType.NO_REPLY,
      to: mailData.to,
      subject: welcomeSubject,
      context: {
        title: welcomeSubject,
        actionTitle: welcomeSubject,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),

        ...mailData.context,
      },
      userId: mailData.userId,
      regulation: mailData.regulation,
      regulationId: mailData.regulationId,
    });
  }

  async sendAgreementEmail(mailData: {
    to: string;
    uuid: string;
    docsUploaded: boolean;
    firstName: string;
    password: string;
    userId: number;
    regulation?: string;
    step: number;
    regulationId?: number;
  }) {
    await this.mailerService.sendAgreementEmails({
      from: MailSenderType.NO_REPLY,
      to: mailData.to,
      subject: 'Agreement Email',
      uuid: mailData.uuid,
      docsUploaded: mailData.docsUploaded,
      languageIso: '',
      context: {
        firstName: mailData.firstName,
        password: mailData.password,
        userId: mailData.userId,
        regulation: mailData.regulation,
        regulationId: mailData.regulationId,
      },
      step: mailData.step,
      regulationId: mailData.regulationId,
    });
  }

  async sendTradingAccountPassword(
    mailData: MailData<{
      password: string;
      login: string;
      accountType: string;
      firstName: string;
    }>,
    userId: number,
    regulation?: string,
    regulationId?:number
  ): Promise<void> {
    const i18n = I18nContext.current();
    let passwordTitle: MaybeType<string>;

    if (i18n) {
      [passwordTitle] = await Promise.all([
        i18n.t('common.tradingAccountPassword'),
      ]);
    }

    const templateName =
      mailData.data.accountType?.toLowerCase() === 'live'
        ? MailTemplateIds.TRADING_ACCOUNT_PASSWORD_LIVE
        : MailTemplateIds.TRADING_ACCOUNT_PASSWORD_DEMO;

    await this.mailerService.sendEmail({
      from: MailSenderType.NO_REPLY,
      to: mailData.to,
      subject: passwordTitle,
      context: {
        title: passwordTitle,
        actionTitle: passwordTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        firstName: mailData.data.firstName,
        login: mailData.data.login,
        password: mailData.data.password,
        accountType: mailData.data.accountType,
      },
      templateName,
      userId,
      regulation,
      regulationId
    });
  }

  async getInboxEmail(payload: any) {
    return await this.mailerService.getEmailInbox(payload);
  }

  async getInboxEmailByLead(payload: any) {
    return await this.mailerService.getEmailInboxByLead(payload);
  }

  async getInboxEmailById(payload: any) {
    return await this.mailerService.getEmailInboxById(payload);
  }
}
