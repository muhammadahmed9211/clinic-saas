import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerService } from 'src/admin/partner/partner.service';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { ActiveStatus, Partner } from 'src/settings/entities/partner.entity';
import { User } from 'src/users/entities/user.entity';
import { AccountService } from 'src/mt5/account/account.service';
import { ServerName } from 'src/wallet/entities/server.entity';
import { AdminKycService } from 'src/admin/kyc/kyc.service';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { CreateIBAutomationDto } from './dto/create-ib-automation.dto';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';
import {
  AccountClassification,
  Client,
} from 'src/users/entities/client.entity';
import { SendEmailService } from 'src/common/services/send-email.service';
import { OperatorRepository } from 'src/admin/operator/repositories/operator.repository';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { IbProfileService } from 'src/ib/ib_profile/ib_profile.service';
import { LinkType } from 'src/admin/partner/entities/partner-links.entity';

@Injectable()
export class IbAutomationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(IbCommissionProfile)
    private readonly ibCommissionProfileRepository: Repository<IbCommissionProfile>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(FileEntity)
    private readonly fileEntityRepository: Repository<FileEntity>,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly partnerService: PartnerService,
    private readonly accountService: AccountService,
    private readonly userKycService: AdminKycService,
    private readonly sendEmailService: SendEmailService,
    private readonly ibProfileService: IbProfileService
  ) { }

  async setUserType(body: CreateIBAutomationDto, userId: number) {
    const isKycApproved = await this.userKycService.isUserKycApproved(userId);
    if (!isKycApproved) {
      throw new BadRequestException(
        'KYC needs approval first before becoming an IB',
      );
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: { client: true },
    });
    const isRegisteredAsIB = user?.client?.type === 'Introducing Broker (IB)';
    if (!isRegisteredAsIB) {
      await this.clientRepository.update(
        { userId },
        {
          type: body.type,
        },
      );
    }
    return isRegisteredAsIB;
  }

  async verify(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: { client: { commissionProfile: true } },
    });

    if (user?.client?.type !== 'Introducing Broker (IB)') {
      throw new BadRequestException('Partner is not IB');
    }

    const isKycApproved = await this.userKycService.isUserKycApproved(user.id);
    if (!isKycApproved) {
      throw new BadRequestException(
        'KYC needs approval first before becoming an IB',
      );
    }

    return user;
  }

  async setup(userId: number, isRegisteredAsIB: boolean = false) {
    const userPayload = { id: userId } as JwtPayloadType;
    const user = await this.verify(userPayload.id);
    const client = user.client;
    if (!user) {
      throw new BadRequestException('User not found');
    }

    let origin = this.configService.getOrThrow('app.frontendDomain', {
      infer: true,
    });

    const Currency = 'USD';

    const systemUser = await this.userRepository.findOne({
      where: { operator: { full_name: 'System' } },
      relations: ['operator'],
    });

    if (!systemUser) {
      throw new BadRequestException('An error occurred');
    }

    const password = 'not applicable';
    const status = ActiveStatus.ACTIVE;
    const telephone = user?.telephone;
    const name = user.fullName || '';
    const email = user.email || '';

    if (!telephone || !name || !email) {
      throw new BadRequestException('User details not found');
    }

    const account = await this.accountService.createAccount(
      {
        Server: ServerName.LIVE,
        Email: email,
        Currency
      },
      user,
      true,
      systemUser,
      true
    );
    if (!account) {
      throw new BadRequestException(
        'Error occurred during MT5 Agent Account creation',
      );
    }
    const userIbId = account.result?.answer.Login;
    if (!userIbId) {
      throw new BadRequestException('Login not found');
    }

    const partner = await this.partnerService.createPartner(
      {
        password,
        telephone: telephone,
        status,
        contactName: name,
        email,
        name,
        title: name,
      },
      userPayload,
    );

    if (!partner) {
      throw new BadRequestException('Error occurred during partner creation');
    }

    let partnerLevel = 1;
    let masterIbId: undefined | number = undefined;
    if (client.affid && isRegisteredAsIB) {
      const { level, partner } = await this.partnerService.getPartnerLevel(client.affid);
      if (partner) {
        masterIbId = partner.id
      }
      if (level) {
        partnerLevel = partnerLevel + level;
      }
    }

    const mt5AccountSetup = await this.partnerService.updatePartner(
      partner.id,
      {
        userIbId,
      },
      user.id,
    );

    if (!mt5AccountSetup) {
      throw new BadRequestException(
        'Error occurred during MT5 Account Binding',
      );
    }

    const ib = await this.partnerService.createIb(
      partner.id,
    );

    if (!ib) {
      throw new BadRequestException('IB Creation Failed');
    }

    const updatedProfile =
      await this.partnerService.updatePartnerProfileAssignment(
        partner.id,
        {
          calculateCommission: true,
          partnerLevel: partnerLevel,
          masterIbId
        },
        user,
        true,
      );


    try {
      const commissionProfile = await this.ibCommissionProfileRepository.find({
        where: {
          level: partnerLevel,
          isActive: true,
          isPublic: true,
        },
      });

      const profileIds = commissionProfile.map((c) => c.id)
      await this.ibProfileService.assignCommissionProfiles(partner.id, profileIds)

      const results = await Promise.all(
        commissionProfile.map(({ id }) =>
          this.partnerService.generatePartnerLink(
            { origin },
            { partnerId: partner.id, utmSource: "IB", source: "IBRegistrationLink", commissionProfileId: id },
            user.id,
          ),
        ),
      );

      this.partnerService.generatePartnerLink(
        { origin },
        { partnerId: partner.id, utmSource: "IB", source: "IBRegistrationLink" },
        user.id,
        LinkType.SUB_IB
      );

      if (results.some((link) => !link)) {
        throw new BadRequestException('Error occurred during partner creation');
      }
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Error occurred during partner creation',
      );
    }

    try {
      if (systemUser && systemUser.operator && systemUser.operator.id) {
        const attachment = await this.fileEntityRepository.findOne({
          where: {
            fileName: 'IB_Terms_And_Conditions.pdf',
          },
        });
        if (!attachment) {
          throw new BadRequestException('Attachment not found!');
        }

        if (systemUser && systemUser?.operator && systemUser?.operator.id) {
          const template = 'IB_AUTOMATION_KYC_APPROVAL';
          await this.sendEmailService.sendEmailToClient({
            entityName: 'client',
            entityValue: userId.toString(),
            createdForId: userId,
            emailEventName: template,
            operatorId: systemUser?.operator?.id,
            fileUuids: [attachment.id],
          });
        }
      }
    } catch (error) {
      console.error(error, 'ERROR While sending email');
    }

    return updatedProfile;
  }
}
