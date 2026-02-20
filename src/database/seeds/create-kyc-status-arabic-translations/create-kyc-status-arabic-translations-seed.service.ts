import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CreateKycStatusArabicTranslationsSeedService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    @InjectRepository(LabelTranslation)
    private labelTranslationRepository: Repository<LabelTranslation>,
  ) {}

  async run() {
    const labelData = [
      'Partial Kyc',
      'Approved',
      'Pending Review',
      'Rejected',
      'Your Kyc status has been updated to: Partial Kyc',
      'Your Kyc status has been updated to: Approved',
      'Your Kyc status has been updated to: Pending Review',
      'Your Kyc status has been updated to: Rejected',
    ];

    const labelTranslationData = [
      {
        langCode: 'en',
        text: 'Partial Kyc',
        label: { id: 18 },
      },
      {
        langCode: 'en',
        text: 'Approved',
        label: { id: 19 },
      },
      {
        langCode: 'en',
        text: 'Pending Review',
        label: { id: 20 },
      },
      {
        langCode: 'en',
        text: 'Rejected',
        label: { id: 21 },
      },
      {
        langCode: 'en',
        text: 'Your KYC status has been updated to: Partial Kyc',
        label: { id: 22 },
      },
      {
        langCode: 'en',
        text: 'Your KYC status has been updated to: Approved',
        label: { id: 23 },
      },
      {
        langCode: 'en',
        text: 'Your KYC status has been updated to: Pending Review',
        label: { id: 24 },
      },
      {
        langCode: 'en',
        text: 'Your KYC status has been updated to: Rejected',
        label: { id: 25 },
      },
      {
        langCode: 'ar',
        text: 'معرفة جزئية للعميل الخاص بك',
        label: { id: 18 },
      },
      {
        langCode: 'ar',
        text: 'موافقة',
        lable: { id: 19 },
      },
      {
        langCode: 'ar',
        text: 'في انتظار المراجعة',
        label: { id: 20 },
      },
      {
        langCode: 'ar',
        text: 'مرفوض',
        label: { id: 21 },
      },
      {
        langCode: 'ar',
        text: 'تم تحديث حالة kyc الخاصة بك إلى kyc جزئية',
        label: { id: 22 },
      },
      {
        langCode: 'ar',
        text: 'تم تحديث حالة kyc الخاصة بك إلى تمت الموافقة عليها',
        label: { id: 23 },
      },
      {
        langCode: 'ar',
        text: 'تم تحديث حالة kyc الخاصة بك إلى المراجعة المعلقة',
        label: { id: 24 },
      },
      {
        langCode: 'ar',
        text: 'تم تحديث حالة kyc الخاصة بك إلى مرفوضة',
        label: { id: 25 },
      },
    ];

    const labelKey = await this.labelRepository.find({
      where: {
        key: In(labelData),
      },
    });

    const labelTransaltion = await this.labelTranslationRepository.find({
      where: {
        text: In(labelData),
      },
    });

    if (labelKey.length === 0) {
      const labelEntity = labelData.map((label) =>
        this.labelRepository.create({ key: label }),
      );
      await this.labelRepository.save(labelEntity);
    }

    if (labelTransaltion.length === 0) {
      await this.labelTranslationRepository.save(labelTranslationData);
    }
  }
}
