import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { MasterTask } from 'src/tasks/entities/master_task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MasterTaskSeedService {
  constructor(
    @InjectRepository(MasterTask)
    private readonly repository: Repository<MasterTask>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    @InjectRepository(LabelTranslation)
    private readonly labelTranslationRepository: Repository<LabelTranslation>,
  ) {}

  async run() {
    const count = await this.repository.count();
    const labelCount = await this.labelRepository.count();
    const labelTransCount = await this.labelTranslationRepository.count();

    const labelData = [
      {
        key: 'clientregistration_contact_details',
        description: 'Step 1 Contact Details',
      },
      {
        key: 'clientregistration_financial_info',
        description: 'Step 2 Financial information',
      },
      {
        key: 'clientregistration_expereince_assessment',
        description: 'Step 3 Experience details.',
      },
      {
        key: 'clientregistration_declaration_signature',
        description: 'Step 4 Agreement & Signature details.',
      },
      {
        key: 'clientregistration_identity_document_upload',
        description: 'Upload Proof of Identity Docs.',
      },
      {
        key: 'clientregistration_address_document_upload',
        description: 'Upload Proof of Address Docs.',
      },
      {
        key: 'clientregistration_payment_document_upload',
        description: 'Upload Proof of Payment Docs.',
      },
      {
        key: 'clientregistration_update_kyc_docs',
        description: 'Update KYC Documents.(in case of rejection)',
      },
      {
        key: 'clientregistration_complete_kyc_docs',
        description: 'Complete KYC missing Documents',
      },
      {
        key: 'clienttrading_start_livetrading',
        description: 'Start Trading on MT5',
      },
    ];

    const labelTranslationData = [
      {
        langCode: 'en',
        text: 'Please note! To start live trading, please update your contact details',
        label: { id: 1 },
      },
      {
        langCode: 'en',
        text: 'Please note! To start live trading, please complete your Financial Information',
        label: { id: 2 },
      },
      {
        langCode: 'en',
        text: 'Please note! To start live trading, please complete your Experience Assessment & KYC Documents',
        label: { id: 3 },
      },
      {
        langCode: 'en',
        text: 'Please note! To start live trading, please give your Declaration & Signature',
        label: { id: 4 },
      },
      {
        langCode: 'en',
        text: 'Please note! To Complete your KYC Documentation,  Please Upload missing Proof of Identity ',
        label: { id: 5 },
      },
      {
        langCode: 'en',
        text: 'Please note! To Complete KYC Documentation Please Upload missing Proof of Address',
        label: { id: 6 },
      },
      {
        langCode: 'en',
        text: 'Please make a note of the following: to submit a Withdrawal Request, you need to upload proof of payment documents.',
        label: { id: 7 },
      },
      {
        langCode: 'en',
        text: 'Please Note! To Complete KYC Documentation Please Update KYC Document [doc title] rejected',
        label: { id: 8 },
      },
      {
        langCode: 'ar',
        text: 'رجى تحديث تفاصيل الاتصال الخاصة بكيرجى الملاحظة! لبدء التداول المباشر، يرجى تحديث تفاصيل الاتصال الخاصة بك',
        label: { id: 1 },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! لبدء التداول المباشر، يرجى إكمال معلوماتك المالية',
        label: { id: 2 },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! لبدء التداول المباشر، يرجى إكمال مستندات تقييم الخبرة ومعرفة عميلك ',
        label: { id: 3 },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! لبدء التداول المباشر، يرجى تقديم الإقرار والتوقيع الخاص بك',
        label: { id: 4 },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! لإكمال وثائق معرفة عميلك الخاصة بك، الرجاء قم بتحميل مستند  إثبات الهوية ',
        label: { id: 5 },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! لإكمال وثائق معرفة عميلك ، يرجى تحميل مستند إثبات العنوان المفقود',
        label: { id: 6 },
      },
      {
        langCode: 'ar',
        text: 'يرجى ملاحظة ما يلي: لتقديم طلب سحب، يتعين عليك تحميل مستندات إثبات الدفع',
        label: { id: 7 },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! لإكمال وثائق معرفة عميلك، يرجى تحديث مستند KYC [doc title]  الذي تم رفضه',
        label: { id: 8 },
      },
    ];

    if (labelCount === 0) {
      await this.labelRepository.save(labelData);
    }

    if (count === 0) {
      const taskData = [
        {
          name: 'clientregistration_contact_details',
          description: 'Step 1 Contact Details',
          masterUrl: '/kyc-form',
          successor: 2,
          isForcedComplete: true,
          label: { id: 1 },
          responsible: 'user',
        },
        {
          name: 'clientregistration_financial_info',
          description: 'Step 2 Financial information',
          masterUrl: '/kyc-form',
          predecessor: 1,
          successor: 3,
          isForcedComplete: true,
          label: { id: 2 },
          responsible: 'user',
        },
        {
          name: 'clientregistration_expereince_assessment',
          description: 'Step 3 Experience details.',
          masterUrl: '/kyc-form',
          predecessor: 2,
          successor: 4,
          isForcedComplete: true,
          label: { id: 3 },
          responsible: 'user',
        },
        {
          name: 'clientregistration_declaration_signature',
          description: 'Step 4 Agreement & Signature details.',
          masterUrl: '/kyc-form',
          predecessor: 3,
          successor: 5,
          isForcedComplete: true,
          label: { id: 4 },
          responsible: 'user',
        },
        {
          name: 'clientregistration_identity_document_upload',
          description: 'Upload Proof of Identity Docs.',
          masterUrl: '/document-upload',
          predecessor: 4,
          successor: 6,
          isForcedComplete: true,
          label: { id: 5 },
          responsible: 'user',
        },
        {
          name: 'clientregistration_address_document_upload',
          description: 'Upload Proof of Address Docs.',
          masterUrl: '/document-upload',
          predecessor: 5,
          successor: 7,
          label: { id: 6 },
          responsible: 'user',
        },
        {
          name: 'clientregistration_payment_document_upload',
          description: 'Upload Proof of Payment Docs.',
          masterUrl: '/document-upload',
          predecessor: 6,
          label: { id: 7 },
          responsible: 'user',
        },
        {
          name: 'clientregistration_update_kyc_docs',
          description: 'Update KYC Documents.(in case of rejection)',
          masterUrl: '/kyc/kycapproval',
          isForcedComplete: false,
          sla: 24,
          label: { id: 8 },
          responsible: 'KYC Desk',
        },
        {
          name: 'clientregistration_complete_kyc_docs',
          description: 'Complete KYC missing Documents',
          masterUrl: '/kyc/kycapproval',
          isForcedComplete: false,
          sla: 24,
          responsible: 'KYC Desk',
        },
        {
          name: 'clienttrading_start_livetrading',
          description: 'Start Trading on MT5',
          masterUrl: '/kyc/kycapproval',
          isForcedComplete: false,
          sla: 24,
          responsible: 'KYC Desk',
        },
      ];

      await this.repository.save(taskData);
    }

    if (labelTransCount === 0) {
      await this.labelTranslationRepository.save(labelTranslationData);
    }
  }
}
