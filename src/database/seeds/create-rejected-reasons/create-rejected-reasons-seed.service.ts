import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RejectedReason } from 'src/admin/kyc/entities/rejected_reasons.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CreateRejectedReasonsSeedService {
  constructor(
    @InjectRepository(RejectedReason)
    private repository: Repository<RejectedReason>,
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    @InjectRepository(LabelTranslation)
    private labelTranslationRepository: Repository<LabelTranslation>,
  ) {}

  async run() {
    const lablecount = await this.labelRepository.count();
    const count = await this.repository.count();

    if (lablecount > 10 && count === 0) {
      const reasons = [
        { name: 'Fake', label: { id: 11 } },
        { name: 'Not clear (blurred)', label: { id: 12 } },
        { name: 'Size too small', label: { id: 13 } },
        { name: 'Irrelevant', label: { id: 14 } },
        { name: 'Expired', label: { id: 15 } },
        { name: 'No match image', label: { id: 16 } },
        { name: 'Other', label: { id: 17 } },
      ];

      await this.repository.save(reasons);
    }

    const labelData = [
      'Fake',
      'Not clear (blurred)',
      'Size too small',
      'Irrelevant',
      'Expired',
      'No match image',
      'Other',
    ];

    const labelTranslationData = [
      {
        langCode: 'en',
        text: 'Fake',
        label: { id: 11 },
      },
      {
        langCode: 'en',
        text: 'Not clear (blurred)',
        label: { id: 12 },
      },
      {
        langCode: 'en',
        text: 'Size too small',
        label: { id: 13 },
      },
      {
        langCode: 'en',
        text: 'Irrelevant',
        label: { id: 14 },
      },
      {
        langCode: 'en',
        text: 'Expired',
        label: { id: 15 },
      },
      {
        langCode: 'en',
        text: 'No match image',
        label: { id: 16 },
      },
      {
        langCode: 'en',
        text: 'Other',
        label: { id: 17 },
      },
      {
        langCode: 'ar',
        text: 'مزيف',
        label: { id: 11 },
      },
      {
        langCode: 'ar',
        text: 'غير واضح',
        lable: { id: 12 },
      },
      {
        langCode: 'ar',
        text: 'الحجم صغير جدًا',
        label: { id: 13 },
      },
      {
        langCode: 'ar',
        text: 'عَرَضِيّ',
        label: { id: 14 },
      },
      {
        langCode: 'ar',
        text: 'منتهي الصلاحية',
        label: { id: 15 },
      },
      {
        langCode: 'ar',
        text: 'لا توجد صورة مطابقة',
        label: { id: 16 },
      },
      {
        langCode: 'ar',
        text: 'آخر',
        label: { id: 17 },
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

    console.log('labelKey: ', labelKey);
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
