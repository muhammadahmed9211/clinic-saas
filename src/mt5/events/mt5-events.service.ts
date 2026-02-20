import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { MailSenderType } from 'src/email/dto/mail.send.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { Client } from 'src/users/entities/client.entity';
import { Repository } from 'typeorm';
import { Mt5Account } from '../entities/mt5-account.entity';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { PushNotificationService } from 'src/push-notification/push-notification.service';
import { SendPushNotificationRequest } from 'src/push-notification/dto/push-notification.dto';

@Injectable()
export class Mt5EventsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  async processMarginCall(event: any): Promise<any> {
    console.log('Processing Margin Call Event:', event);

    const eventData = typeof event === 'string' ? JSON.parse(event) : event;
    const login = eventData?.tradeMarginCall?.login;

    console.log('Login:', login);
    if (!login) {
      console.error('Login not found in event data');
      return;
    }

    const mt5Account = await this.mt5AccountRepository.findOne({
      where: { login },
      relations: ['user.client'],
    });

    if (!mt5Account) {
      console.error('MT5 Account not found:', login);
      return;
    }

    const client = mt5Account?.user.client;

    if (!client) {
      console.error('Client not found for MT5 Account:', login);
      return;
    }

    let crmLink = this.configService.getOrThrow('app.crmFrontEndUrl', {
      infer: true,
    });

    crmLink = `${crmLink}/clients/${client?.userId}`;

    const fcmTokens = await this.pushNotificationService.getFcmTokensByUserId(
      client.userId,
    );

    const notificationPayload: SendPushNotificationRequest = {
      userId: client.userId,
      eventType: 'MARGIN_CALL',
      templateCode: 'MARGIN_CALL_ALERT',
      source: 'rest-api',
      templateVariables: {
        mt5AccountId: login,
      },
      channels: ['push'],
      // deviceToken: fcmTokens[0],
    };

    await this.pushNotificationService.sendPushNotification(
      notificationPayload,
    );

    if (client.retentionRepId && client.retentionRepId !== 0) {
      const retentionRep = await this.operatorRepository.findOne({
        where: { id: client?.retentionRepId },
      });

      if (retentionRep) {
        const manager = await this.operatorRepository.findOne({
          where: { id: retentionRep?.manager_operator_id },
        });

        this.mailerService.sendEmail({
          from: MailSenderType.NO_REPLY,
          to: retentionRep.email,
          cc: manager?.email,
          subject: 'Your client is on Margin Call, Urgent Redeposit required',
          templateName: 'MARGIN_CALL_ALERT',
          context: {
            operatorName: retentionRep?.full_name,
            crmClientId: client?.userId.toString(),
            firstName: client?.firstName,
            lastName: client?.lastName,
            emailAddress: client?.email,
            mt5AccountId: login,
            crmLink,
            marginlevel: eventData?.tradeMarginCall?.marginlevel,
            equity: eventData?.tradeMarginCall?.equity,
          },
        });
      }
    }

    if (client.salesRepId && client.salesRepId !== 0) {
      const salesRep = await this.operatorRepository.findOne({
        where: { id: client?.salesRepId },
      });

      if (salesRep) {
        const manager = await this.operatorRepository.findOne({
          where: { id: salesRep?.manager_operator_id },
        });

        this.mailerService.sendEmail({
          from: MailSenderType.NO_REPLY,
          to: salesRep.email,
          cc: manager?.email,
          subject: 'Your client is on Margin Call, Urgent Redeposit required',
          templateName: 'MARGIN_CALL_ALERT',
          context: {
            operatorName: salesRep?.full_name,
            crmClientId: client?.userId.toString(),
            firstName: client?.firstName,
            lastName: client?.lastName,
            emailAddress: client?.email,
            mt5AccountId: login,
            crmLink,
            marginlevel: eventData?.tradeMarginCall?.marginlevel,
            equity: eventData?.tradeMarginCall?.equity,
          },
        });
      }
    }

    return 'Success';
  }

  async processStopOut(event: any): Promise<any> {
    console.log('Processing Stop Out Event:', event);

    const eventData = typeof event === 'string' ? JSON.parse(event) : event;
    const login = eventData?.tradeStopOut?.login;

    console.log('Login:', login);
    if (!login) {
      console.error('Login not found in event data');
      return;
    }

    const mt5Account = await this.mt5AccountRepository.findOne({
      where: { login },
      relations: ['user.client'],
    });

    if (!mt5Account) {
      console.error('MT5 Account not found:', login);
      return;
    }

    const client = mt5Account?.user.client;

    if (!client) {
      console.error('Client not found for MT5 Account:', login);
      return;
    }

    let crmLink = this.configService.getOrThrow('app.crmFrontEndUrl', {
      infer: true,
    });

    crmLink = `${crmLink}/clients/${client?.userId}`;

    const fcmTokens = await this.pushNotificationService.getFcmTokensByUserId(
      client.userId,
    );

    const notificationPayload: SendPushNotificationRequest = {
      userId: client.userId,
      eventType: 'STOP_OUT',
      templateCode: 'STOP_OUT_ALERT',
      source: 'rest-api',
      templateVariables: {
        mt5AccountId: login,
      },
      channels: ['push'],
      // deviceToken: fcmTokens[0],
    };

    await this.pushNotificationService.sendPushNotification(
      notificationPayload,
    );

    if (client.retentionRepId && client.retentionRepId !== 0) {
      const retentionRep = await this.operatorRepository.findOne({
        where: { id: client?.retentionRepId },
      });

      if (retentionRep) {
        const manager = await this.operatorRepository.findOne({
          where: { id: retentionRep?.manager_operator_id },
        });

        this.mailerService.sendEmail({
          from: MailSenderType.NO_REPLY,
          to: retentionRep.email,
          cc: manager?.email,
          subject:
            'Your client got stopped out - You being unsuccessful to take RD',
          templateName: 'STOP_OUT_ALERT',
          context: {
            operatorName: retentionRep?.full_name,
            crmClientId: client?.userId.toString(),
            firstName: client?.firstName,
            lastName: client?.lastName,
            emailAddress: client?.email,
            mt5AccountId: login,
            crmLink,
            marginlevel: eventData?.tradeStopOut?.marginlevel,
            equity: eventData?.tradeStopOut?.equity,
          },
        });
      }
    }

    if (client.salesRepId && client.salesRepId !== 0) {
      const salesRep = await this.operatorRepository.findOne({
        where: { id: client?.salesRepId },
      });

      const manager = await this.operatorRepository.findOne({
        where: { id: salesRep?.manager_operator_id },
      });

      if (salesRep) {
        this.mailerService.sendEmail({
          from: MailSenderType.NO_REPLY,
          to: salesRep.email,
          cc: manager?.email,
          subject:
            'Your client got stopped out - You being unsuccessful to take RD',
          templateName: 'STOP_OUT_ALERT',
          context: {
            operatorName: salesRep?.full_name,
            crmClientId: client?.userId.toString(),
            firstName: client?.firstName,
            lastName: client?.lastName,
            emailAddress: client?.email,
            mt5AccountId: login,
            crmLink,
            marginlevel: eventData?.tradeStopOut?.marginlevel,
            equity: eventData?.tradeStopOut?.equity,
          },
        });
      }
    }

    return 'Success';
  }
}
