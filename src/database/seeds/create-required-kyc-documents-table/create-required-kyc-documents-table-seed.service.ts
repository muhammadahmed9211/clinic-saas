import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { required_kyc_documents } from 'src/admin/kyc/entities/admin-kyc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateRequiredKYCDocumentsTableSeedService {
  constructor(
    @InjectRepository(required_kyc_documents)
    private repository: Repository<required_kyc_documents>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      const documentsData = [
        {
          name: 'Proof of Identity',
          description:
            'A clear colored copy of the front as well as the back of a valid passport OR a clear colored copy of the National ID together with Driving License.',
          meta_data: {
            field_name: 'Identity Document Type',
            is_dropdown: true,
            field_values: [
              {
                id: 'id_card',
                label: 'ID Card',
                description: 'Upload Your ID Card',
                front_side: 'ID Card Front',
                back_side: 'ID Card Back',
              },
              {
                id: 'passport',
                label: 'Passport',
                description: 'Upload Passport Image',
              },
              {
                id: 'driving_license',
                label: 'Driving License',
                description: 'Upload Your Driving License',
                front_side: 'Driving License Front',
                back_side: 'Driving License Back',
              },
            ],
          },
        },
        {
          name: 'Proof of Address',
          description:
            'An official utility bill dated within the last 6 months, issued in your name, showing your full current address, with the logo of the issuer. Utility bills with only P.O. Box and electronic bills will not be accepted.',
          meta_data: {
            field_name: 'Address Verification Document Type',
            is_dropdown: true,
            field_values: [
              {
                id: 'utility_bill',
                label: 'Utility Bill',
                description: 'Upload Utility Bill',
              },
              {
                id: 'bank_statement',
                label: 'Bank Statement',
                description: 'Upload Bank Statement',
              },
              {
                id: 'other',
                label: 'Other',
                description: 'Upload Other Supporting Document',
              },
            ],
          },
        },
        {
          name: 'Proof of Payments',
          description:
            'This document is not required for KYC approval. Copy of the Credit Card used for depositing',
          meta_data: {
            is_dropdown: false,
            field_values: [],
            card_details: [
              {
                id: 'card_front',
                type: 'Front',
                bullets: [
                  'Showing your full name',
                  'With a valid expiration date',
                  'Showing the last 4 digits of the card (hide the other digits)',
                ],
              },
              {
                id: 'card_back',
                type: 'Back',
                bullets: [
                  'The signature on the stripe',
                  'Hiding the CVV number',
                  'Hide all the digits of the credit card except the last 4',
                ],
              },
            ],
          },
        },
        {
          name: 'IB Aggrements',
          description: 'This document is for IB Aggrements',
          meta_data: {
            field_name: 'IB',
            is_dropdown: false,
            field_values: [
              {
                id: 'ib_aggrements',
                label: 'IB Aggrements',
                description: 'This document is for IB Aggrements',
              },
            ],
          },
          isPartner: true,
        },
      ];

      for (const data of documentsData) {
        await this.repository.save(
          this.repository.create({
            name: data.name,
            description: data.description,
            meta_data: JSON.stringify(data.meta_data),
          }),
        );
      }
    }
  }
}
