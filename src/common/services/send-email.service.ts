import {
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { EmailEntity } from 'src/mail/entities/email-entity.entity';
import { EmailEvent } from 'src/admin/email-mapping/entity/email-event.entity';
import { EmailMapping } from 'src/admin/email-mapping/entity/email-mapping.entity';
import { Template } from 'src/mail/entities/template.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import moment from 'moment-timezone';
import { TrustedAdvisor } from 'aws-sdk';
import { Client } from 'src/users/entities/client.entity';
export class SendEmailService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly mailerService: MailerService,
     private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(EmailEntity)
    private emailEntityRepository: Repository<EmailEntity>,
    @InjectRepository(EmailEvent)
    private emailEventRepository: Repository<EmailEvent>,
    @InjectRepository(EmailMapping)
    private emailMappingRepository: Repository<EmailMapping>,
    private clientsRepository: ClientRepository,
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    @InjectRepository(EmailEntity)
    private readonly entitiyRepository: Repository<EmailEntity>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) { }

  async sendDynamicEmailWithVaribale(
       sendEmailDto: any,
    ) {
      try {
        const {
          templateId,
          userId,
          subject,
          from,
          to,
          entityId,
          entityValue,
          operatorId,
          regulationId,
          regulation,
          leadId,
          languageIso,
          layoutId,
          externalVariables,
          fileUuids,
          userAgreement,
          emailEventName
        } = sendEmailDto;
    
        let templateEntity: any = null;
        if (templateId) {
        templateEntity =
        await this.getTemplateEntity(templateId);
        }
        
    
        if (!templateEntity) {
          throw new NotFoundException('No entity found for the given template ID');
        }
    
        const { name: entityType } = templateEntity.entity;
        const { name: templateName } = templateEntity;
    
        const dynamicData = await this.fetchTemplateVariables(
          entityId,
          entityType,
          entityValue,
        );
        await this.sendDynamicEmail({
          template: templateName,
          subject,
          from,
          to,
          operatorId,
          userId,
          regulationId,
          regulation,
          dynamicData,
          leadId,
          languageIso,
          layoutId,
          externalVariables,
          fileUuids,
          userAgreement,
          emailEventName
        });
    
        return { message: 'Email sent successfully' };
      } catch (error) {
        console.log('error: ', error);
        throw error
      }
  }

  async getEntityByName(name: string) {
    const entity = await this.emailEntityRepository.findOne({ where: { name } });
    if (!entity) throw new Error(`Entity with name ${name} not found`);
    return entity;
  }

  async getUserById(userId: any) {
    const user = await this.userRepository.findOne({
      where: { id:userId },
    });
    return user;
  }

  async getUsers(userIds: number[]) {
    const users = await this.userRepository.find({
      where: { operator:{id:In(userIds) }},
      select:['email']
    });
    return users;
  }

  async getClientById(userId: number) {
    const client = await this.clientsRepository.findOne({
      where: { userId },
      relations: { regulation: true },
    });
    if (!client) throw new Error(`Client with userId ${userId} not found`);
    return client;
  }

  async getLeadById(id: number) {
    const client = await this.leadRepository.findOne({
      where:{id},
      relations: { regulation: true },
    });
    if (!client) throw new Error(`Lead with id ${id} not found`);
    return client;
  }
  
  async getEmailEventByName(name: string) {
    const emailEvent = await this.emailEventRepository.findOne({
      where: { name },
      select: ['id'],
    });
    if (!emailEvent) throw new Error(`Email event with name ${name} not found`);
    return emailEvent;
  }

  async getEmailMappings(client, emailEvent) {
    const emailMappings = await this.emailMappingRepository.findOne({
      where: {
        emailEvent: { id: emailEvent.id },
        regulation: { id: client.regulation?.id },
        langCode: client.languageIso?.toLowerCase(),
      },
      relations: {
        bodyContent: true,
        headerFooter: true,
        emailEvent: true,
      },
    });
    if (!emailMappings) throw new Error(`Email mappings not found for the given client and email event`);
    return emailMappings;
  }

  async getEmailMappingsOnLanguage(language, regulationId, emailEvent) {
    const emailMappings = await this.emailMappingRepository.findOne({
      where: {
        emailEvent: { id: emailEvent.id },
        regulation: { id: regulationId },
        langCode: language?.toLowerCase(),
      },
      relations: {
        bodyContent: true,
        headerFooter: true,
        emailEvent: true,
      },
    });
    if (!emailMappings) throw new Error(`Email mappings not found for the given client and email event`);
    return emailMappings;
  }

  async getLeadEmailMappings(client, emailEvent) {
    const emailMappings = await this.emailMappingRepository.findOne({
      where: {
        emailEvent: { id: emailEvent.id },
        regulation: { id: client.regulation?.id },
        langCode: client?.language == 'English' ? 'en':'ar',
      },
      relations: {
        bodyContent: true,
        headerFooter: true,
        emailEvent: true,
      },
    });
    if (!emailMappings) throw new Error(`Email mappings not found for the given client and email event`);
    return emailMappings;
  }

  async getEmailMappingOperator(emailEvent) {
    const emailMappings = await this.emailMappingRepository.findOne({
      where: {
        emailEvent: { id: emailEvent.id },
        regulation: { name: 'FSCA' },
        langCode: 'en',
      },
      relations: {
        bodyContent: true,
        headerFooter: true,
        emailEvent: true,
        regulation:true
      },
    });
    if (!emailMappings) throw new Error(`Email mappings not found for the given client and email event`);
    return emailMappings;
  }

  getSupportEmail() {
    return this.configService.getOrThrow('mail.supportEmail', { infer: true });
  }

  getNoReplyEmail() {
    return this.configService.getOrThrow('mail.defaultEmail', { infer: true });
  }
  

  async sendEmailToClient({
    entityName,
    entityValue,
    createdForId,
    emailEventName,
    subjectEnglish,
    subjectArabic,
    operatorId,
    from,
    externalVariables,
    fileUuids,
    userAgreement,
  }: {
    entityName: string;
    entityValue: string;
    createdForId: number;
    emailEventName: string;
    operatorId: number;
    subjectEnglish?: string;
    subjectArabic?: string;
    from?:string
    externalVariables?:{ [key: string]: any };
    fileUuids?: string[];
    userAgreement?: { [key: string]: any };
  }): Promise<void> {
   try {
     const entity = await this.getEntityByName(entityName);
     const client = await this.getClientById(createdForId);
     const emailEvent = await this.getEmailEventByName(emailEventName);
     const emailMappings = await this.getEmailMappings(client, emailEvent);
     let subject = client.languageIso === 'EN' ? subjectEnglish : subjectArabic;
     if(emailMappings?.bodyContent?.subject){
      subject = emailMappings?.bodyContent?.subject
     }
     let fromEmail = this.configService.getOrThrow('mail.defaultEmail', { infer: true });
     if(from){
      fromEmail = from;
     }
     const sendEmailDto = {
       entityId: entity?.id,
       entityValue,
       userId: { id: createdForId },
       templateId: emailMappings?.bodyContent?.id,
       layoutId: emailMappings?.headerFooter?.id,
       regulationId: client?.regulation?.id,
       regulation: client.regulations,
       subject,
       from:fromEmail,
       to: client.email,
       operatorid: operatorId,
       languageIso: emailMappings?.bodyContent?.language,
       externalVariables,
       fileUuids,
       userAgreement,
       emailEventName
     };
     await this.sendDynamicEmailWithVaribale(sendEmailDto);
   } catch (error) {
    console.log('error: ', error);
    throw error  
   }
  }

  async sendEmailToAnyone({
    entityName,
    entityValue,
    createdForId,
    emailEventName,
    subjectEnglish,
    subjectArabic,
    operatorId,
    from,
    language,
    regulationId,
    email,
    externalVariables,
    fileUuids,
    userAgreement,
  }: {
    entityName: string;
    entityValue: string;
    createdForId?: number;
    emailEventName: string;
    operatorId: number;
    subjectEnglish?: string;
    subjectArabic?: string;
    from?:string;
    language?: string;
    regulationId?: number;
    email?: string;
    externalVariables?:{ [key: string]: any };
    fileUuids?: string[];
    userAgreement?: { [key: string]: any };
  }): Promise<void> {
   try {
    let client: Client | null = null;
    let subject
    let emailMappings
     const entity = await this.getEntityByName(entityName);
     const emailEvent = await this.getEmailEventByName(emailEventName);
     if(createdForId){
       client = await this.getClientById(createdForId);
       subject = client.languageIso === 'EN' ? subjectEnglish : subjectArabic;
       emailMappings = await this.getEmailMappings(client, emailEvent);
     } else {
      subject = language === 'EN' ? subjectEnglish : subjectArabic;
      emailMappings = await this.getEmailMappingsOnLanguage(language, regulationId, emailEvent);
     }
     if(emailMappings?.bodyContent?.subject){
      subject = emailMappings?.bodyContent?.subject
     }
     let fromEmail = this.configService.getOrThrow('mail.defaultEmail', { infer: true });
     if(from){
      fromEmail = from;
     }
     const sendEmailDto = {
       entityId: entity?.id,
       entityValue,
       userId: { id: createdForId },
       templateId: emailMappings?.bodyContent?.id,
       layoutId: emailMappings?.headerFooter?.id,
       regulationId: client?.regulation?.id,
       subject,
       from:fromEmail,
       to: client ? client.email : email,
       operatorid: operatorId,
       languageIso: emailMappings?.bodyContent?.language,
       externalVariables,
       fileUuids,
       userAgreement,
     };
     await this.sendDynamicEmailWithVaribale(sendEmailDto);
   } catch (error) {
    console.log('error: ', error);
    throw error  
   }
  }


  async sendEmailToLead({
    entityName,
    entityValue,
    createdForId,
    emailEventName,
    operatorId,
    from,
    externalVariables
  }: {
    entityName: string;
    entityValue: string;
    createdForId: number;
    emailEventName: string;
    operatorId: string;
    from:string
    externalVariables?:{ [key: string]: any };
  }): Promise<void> {
   try {
     const entity = await this.getEntityByName(entityName);
     const client = await this.getLeadById(createdForId);
     const emailEvent = await this.getEmailEventByName(emailEventName);
     const emailMappings = await this.getLeadEmailMappings(client, emailEvent);
     const sendEmailDto = {
       entityId: entity?.id,
       entityValue,
       leadId: { id: createdForId },
       templateId: emailMappings?.bodyContent?.id,
       layoutId: emailMappings?.headerFooter?.id,
       regulationId: client?.regulation?.id,
       subject: emailMappings?.bodyContent?.subject,
       from,
       to: client.email,
       operatorid: operatorId,
       languageIso: emailMappings?.bodyContent?.language,
       externalVariables
     };
     await this.sendDynamicEmailWithVaribale(sendEmailDto);
   } catch (error) {
    console.log('error: ', error);
    throw error  
   }
  }


  async sendEmailToOperator({
    entityName,
    entityValue,
    emailEventName,
    subject,
    from,
    operatorId,
    createdForId,
    bulkOperatorIds,
    externalVariables,
  }: {
    entityName: string;
    entityValue: string;
    emailEventName: string;
    subject: string;
    from:string;
    operatorId?: string;
    createdForId?: any;
    bulkOperatorIds?:number[];
    externalVariables?:{ [key: string]: any };
  }): Promise<void> {
   try {
     const entity = await this.getEntityByName(entityName);
     let createdFor: any = null;
     if (createdForId) {
       createdFor = await this.getUserById(createdForId);
     } else if (!bulkOperatorIds || bulkOperatorIds.length === 0) {
       throw new Error("Either 'createdForId' or 'bulkOperatorIds' must be provided.");
     }
     const emailEvent = await this.getEmailEventByName(emailEventName);
     const emailMappings = await this.getEmailMappingOperator(emailEvent);
     let OperatorEmails: (string | null)[] = [];
     if (createdFor?.email) {
      OperatorEmails.push(createdFor.email);
     }
     if(bulkOperatorIds){
      const users = await this.getUsers(bulkOperatorIds)
      const userEmails = users.map(user=>user.email)
      OperatorEmails = [...OperatorEmails,...userEmails]
     }
     const sendEmailDto = {
       entityId: entity?.id,
       entityValue,
       userId: { id: createdForId },
       templateId: emailMappings?.bodyContent?.id,
       layoutId: emailMappings?.headerFooter?.id,
       subject,
       from,
       to: OperatorEmails,
       operatorid: operatorId,
       externalVariables,
     };
     await this.sendDynamicEmailWithVaribale(sendEmailDto);
   } catch (error) {
    console.log('error: ', error);
    throw error  
   }
  }

  async getTemplateEntity(templateId: number): Promise<any> {
    // Fetch a single template variable associated with the given template ID
    return await this.templateRepository.findOne({
      where: { id: templateId },
      relations: {
        entity: true,
      },
    });
  }

  async getEntity(id: number): Promise<any> {
    // Fetch a single template variable associated with the given template ID
    return await this.entitiyRepository.findOne({
      where: { id },
    });
  }

  async fetchTemplateVariables(
    entityId: number,
    entityType: string,
    entityValue: string,
  ): Promise<Record<string, any>> {
    try {
      const entityExists = await this.dataSource
        .createQueryBuilder()
        .select('1')
        .from(entityType, entityType)
        .where(
          entityType === 'client'
            ? `${entityType}.userId = :entityValue`
            : `${entityType}.id = :entityValue`,
          { entityValue },
        )
        .getRawOne();

      if (!entityExists) {
        throw new NotFoundException(
          `Entity of type ${entityType} with value ${entityValue} does not exist.`,
        );
      }
      const entityVariables = await this.dataSource
        .createQueryBuilder()
        .select('variable.id', 'emailVariableId')
        .addSelect('variable.name', 'variableName')
        .from('email_variable', 'variable')
        .innerJoin('email_entity', 'ee', 'variable.emailEntityId = ee.id')
        .where('variable.emailEntityId = :entityId', { entityId })
        .andWhere('variable.is_external = :isExternal', { isExternal: 0 })
        .getRawMany();
      let queryBuilder = this.dataSource.createQueryBuilder().from(entityType, entityType);
      if (entityType === 'client') {
        queryBuilder = queryBuilder.where(`${entityType}.userId = :userId`, { userId: entityValue });
      } else {
        queryBuilder = queryBuilder.where(`${entityType}.id = :id`, { id: entityValue });
      }
      const joinedRelations = new Set<string>();

      for (const varObj of entityVariables) {
        const parts = varObj.variableName.split('.');
        const table = parts[0]; // Main table
        const lastPart = parts[parts.length - 1]; // Column name

        if (parts.length === 2) {
          queryBuilder.addSelect(
            `${table}.${lastPart}`,
            varObj.variableName.replace(/\./g, '_'),
          );
        } else if (parts.length > 2) {
          let currentTable = table;
          let alias = table;
          for (let i = 1; i < parts.length - 1; i++) {
            const relation = parts[i];
            const joinKey = `${currentTable}.${relation}`;
  
            if (!joinedRelations.has(joinKey)) {
              joinedRelations.add(joinKey);
              queryBuilder.innerJoin(`${currentTable}.${relation}`, relation);
            }
  
            currentTable = relation;
            alias = relation;
          }
  
          queryBuilder.addSelect(
            `${alias}.${lastPart}`,
            varObj.variableName.replace(/\./g, '_'),
          );
        }
      }
      const data = await queryBuilder.getRawOne();
      const emailData: Record<string, any> = {};
  
      entityVariables.forEach((varObj) => {
        const variableAlias = varObj.variableName.replace(/\./g, '_');
        let value = data[variableAlias];
        if (value && (varObj.variableName.endsWith('createdAt') || varObj.variableName.endsWith('created_at') || varObj.variableName.endsWith('updated_at') || varObj.variableName.endsWith('updatedAt'))) {
          value = moment.utc(value).format('ddd MMM DD YYYY');
        }
      emailData[varObj.variableName] = value;
      });
      return emailData;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async sendDynamicEmail(data: {
    subject: string;
    template: string;
    from: string;
    to: string| string[];
    operatorId?: number;
    userId?:number;
    regulationId?:number;
    regulation?: string;
    dynamicData?: any;
    manualData?:any
    leadId?:number
    languageIso?:string
    layoutId?:number,
    externalVariables?:{ [key: string]: any };
    fileUuids?: string[];
    userAgreement?: { [key: string]: any };
    emailEventName?:string
  }) {
    const app_name = this.configService.get('app.name', {
      infer: true,
    });
    const { subject, template, from, to, dynamicData,userId,regulationId,operatorId,manualData,leadId,languageIso,layoutId,externalVariables, fileUuids, userAgreement, regulation, emailEventName } = data;
    const context = {
      title: subject,
      actionTitle: subject,
      app_name,
      ...manualData,
      ...externalVariables
    };
    if(dynamicData){
    for (const [key, value] of Object.entries(dynamicData)) {
      const keys = key.split('.');
      keys.reduce((acc, k, i) => {
        if (i === keys.length - 1) {
          acc[k] = value;
        } else {
          acc[k] = acc[k] || {};
        }
        return acc[k];
      }, context);
    }}
    await this.mailerService.sendEmailWithDynamicData({
      from,
      to,
      subject,
      context,
      templateName: template,
      regulationId,
      regulation,
      operatorId,
      userId,
      leadId,
      languageIso,
      layoutId,
      fileUuids,
      userAgreement,
      emailEventName
    });
  }

  async sendDynamicEmailWithoutVaribale(
    sendEmailDto: any,
 ) {
   try {
     const {
       templateId,
       userId,
       subject,
       from,
       to,
       operatorId,
       regulationId,
       manualData,
       layoutId
     } = sendEmailDto;
 
     let templateEntity: any = null;
     if (templateId) {
     templateEntity =
     await this.getTemplateEntity(templateId);
     }
     
 
     if (!templateEntity) {
       throw new NotFoundException('No entity found for the given template ID');
     }
 
     const { name: templateName } = templateEntity;
 
     
     await this.sendDynamicEmail({
       template: templateName,
       subject,
       from,
       to,
       operatorId,
       userId,
       regulationId,
       manualData,
       layoutId
     });
 
     return { message: 'Email sent successfully' };
   } catch (error) {
     console.log('error: ', error);
     throw error
   }
  }

  async sendEmailToOperatorWithoutVariable({
    emailEventName,
    subject,
    from,
    to,
    operatorId,
    createdForId,
    bulkOperatorIds,
    manualData,
    testSmtp = false,
    testSmtpId
  }: {
    emailEventName: string;
    subject?: string;
    from?:string;
    to?:string
    operatorId?: string;
    createdForId?: any;
    bulkOperatorIds?:number[];
    manualData?: {};
    testSmtp?:boolean
    testSmtpId?:number
  }): Promise<void> {
   try {
     let createdFor: any = null;
     if (createdForId) {
       createdFor = await this.getUserById(createdForId);
     }
     const emailEvent = await this.getEmailEventByName(emailEventName);
     const emailMappings = await this.getEmailMappingOperator(emailEvent);
     let OperatorEmails: (string | null)[] = [];
     if(to){
        OperatorEmails.push(to)
     }
     if (createdFor?.email) {
      OperatorEmails.push(createdFor.email);
     }
     if(bulkOperatorIds){
      const users = await this.getUsers(bulkOperatorIds)
      const userEmails = users.map(user=>user.email)
      OperatorEmails = [...OperatorEmails,...userEmails]
     }
     if(testSmtp){
        let emailDto = {
          subject: subject ? subject : emailMappings?.bodyContent?.subject,
          templateName: emailMappings?.bodyContent?.name,
          to:OperatorEmails,
          operatorid: operatorId,
          regulationId: emailMappings?.regulation?.id,
          regulation: emailMappings?.regulation?.name,
          languageIso: emailMappings?.langCode.toLocaleUpperCase(),
          templateId: emailMappings?.bodyContent?.id,
          layoutId: emailMappings?.headerFooter?.id,
          testSmtpId
        }
        const testSmtp =  await this.testSmtp(emailDto)
        return testSmtp
     }
     else{
        const sendEmailDto = {
          userId: { id: createdForId },
          templateId: emailMappings?.bodyContent?.id,
          layoutId: emailMappings?.headerFooter?.id,
          subject: subject ? subject : emailMappings?.bodyContent?.subject,
          from,
          to: OperatorEmails,
          operatorid: operatorId,
          manualData
        };
        await this.sendDynamicEmailWithoutVaribale(sendEmailDto);
     }
   } catch (error) {
    console.log('error: ', error);
    throw error  
   }
  }

  async testSmtp(data: {
    subject: string | null;
    templateName: string;
    to:  (string | null)[];
    operatorId?: number;
    regulationId?:number;
    regulation?:string;
    languageIso?:string
    layoutId?: number
    templateId?:number
    testSmtpId?:number
  }) {
    const app_name = this.configService.get('app.name', {
      infer: true,
    });
    const { subject, templateName, to,regulationId,operatorId,languageIso,layoutId,regulation,testSmtpId } = data;
    const context = {
      title: subject,
      actionTitle: subject,
      app_name,
    };
    const testData = await this.mailerService.testSmtp({
      to,
      subject,
      context,
      templateName,
      regulationId,
      regulation,
      operatorId,
      languageIso,
      layoutId,
      testSmtpId
    });
    console.log('testData: ', testData);
    return testData
  }
  
}
