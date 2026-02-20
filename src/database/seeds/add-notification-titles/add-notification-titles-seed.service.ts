import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationTitles } from 'src/notification/constants/notification.messages';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class titlesSeedService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    @InjectRepository(LabelTranslation)
    private labelTranslationRepository: Repository<LabelTranslation>,
  ) {}

  async run() {
    const labelData = [
      {
        key: 'clientregistration_signup_title',
        description: NotificationTitles.clientregistration_signup_title,
      },
      {
        key: 'clientregistration_contact_details_completed_title',
        description:
          NotificationTitles.clientregistration_contact_details_completed_title,
      },
      {
        key: 'clientregistration_financial_info_completed_title',
        description:
          NotificationTitles.clientregistration_financial_info_completed_title,
      },
      {
        key: 'clientregistration_experience_completed_title',
        description:
          NotificationTitles.clientregistration_experience_completed_title,
      },
      {
        key: 'clientregistration_kyc_under_review_title',
        description:
          NotificationTitles.clientregistration_kyc_under_review_title,
      },
      {
        key: 'clientregistration_identity_document_upload_title',
        description:
          NotificationTitles.clientregistration_identity_document_upload_title,
      },
      {
        key: 'clientregistration_address_document_upload_title',
        description:
          NotificationTitles.clientregistration_address_document_upload_title,
      },
      {
        key: 'clientregistration_kyc_doc_underreview_title',
        description:
          NotificationTitles.clientregistration_kyc_doc_underreview_title,
      },
      {
        key: 'clientregistration_kyc_approved_title',
        description: NotificationTitles.clientregistration_kyc_approved_title,
      },
      {
        key: 'clientregistration_kyc_rejected_title',
        description: NotificationTitles.clientregistration_kyc_rejected_title,
      },
      {
        key: 'clientcompliance_kyc_docs_pending_title',
        description: NotificationTitles.clientcompliance_kyc_docs_pending_title,
      },
      {
        key: 'client_tradeaccount_live_create_title',
        description: NotificationTitles.client_tradeaccount_live_create_title,
      },
      {
        key: 'client_tradeaccount_demo_create_title',
        description: NotificationTitles.client_tradeaccount_demo_create_title,
      },
      {
        key: 'client_deposit_byclient_request_submit_title',
        description:
          NotificationTitles.client_deposit_byclient_request_submit_title,
      },
      {
        key: 'client_deposit_byclient_request_accept_title',
        description:
          NotificationTitles.client_deposit_byclient_request_accept_title,
      },
      {
        key: 'client_deposit_byclient_request_reject_title',
        description:
          NotificationTitles.client_deposit_byclient_request_reject_title,
      },
      {
        key: 'client_deposit_byclient_auto_title',
        description: NotificationTitles.client_deposit_byclient_auto_title,
      },
      {
        key: 'client_deposit_by_admin_approved_title',
        description: NotificationTitles.client_deposit_by_admin_approved_title,
      },
      {
        key: 'client_deposit_byadmin_rejected_title',
        description: NotificationTitles.client_deposit_byadmin_rejected_title,
      },
      {
        key: 'client_withdraw_request_byclient_pending_title',
        description:
          NotificationTitles.client_withdraw_request_byclient_pending_title,
      },
      {
        key: 'clientregistration_payment_doc_upload_task_title',
        description:
          NotificationTitles.clientregistration_payment_doc_upload_task_title,
      },
      {
        key: 'clientregistration_payment_doc_upload_success_title',
        description:
          NotificationTitles.clientregistration_payment_doc_upload_success_title,
      },
      {
        key: 'clientregistration_payment_doc_approved_title',
        description:
          NotificationTitles.clientregistration_payment_doc_approved_title,
      },
      {
        key: 'clientregistration_payment_doc_rejected_title',
        description:
          NotificationTitles.clientregistration_payment_doc_rejected_title,
      },
      {
        key: 'client_withdraw_request_byclient_cancelled_title',
        description:
          NotificationTitles.client_withdraw_request_byclient_cancelled_title,
      },
      {
        key: 'client_withdraw_request_byclient_underreview_title',
        description:
          NotificationTitles.client_withdraw_request_byclient_underreview_title,
      },
      {
        key: 'client_withdraw_request_byclient_approved_title',
        description:
          NotificationTitles.client_withdraw_request_byclient_approved_title,
      },
      {
        key: 'client_withdraw_byadmin_request_underprocess_title',
        description:
          NotificationTitles.client_withdraw_byadmin_request_underprocess_title,
      },
      {
        key: 'client_withdraw_byadmin_request_approved_title',
        description:
          NotificationTitles.client_withdraw_byadmin_request_approved_title,
      },
      {
        key: 'client_transfer_inout_byclient_success_title',
        description:
          NotificationTitles.client_transfer_inout_byclient_success_title,
      },
      {
        key: 'client_transfer_inout__byadmin_success_title',
        description:
          NotificationTitles.client_transfer_inout__byadmin_success_title,
      },
      {
        key: 'client_creditin_byadmin_success_title',
        description: NotificationTitles.client_creditin_byadmin_success_title,
      },
      {
        key: 'client_creditout_byadmin_success_title',
        description: NotificationTitles.client_creditout_byadmin_success_title,
      },
      {
        key: 'client_bonusin_byadmin_success_title',
        description: NotificationTitles.client_bonusin_byadmin_success_title,
      },
      {
        key: 'client_bonusout_byadmin_success_title',
        description: NotificationTitles.client_bonusout_byadmin_success_title,
      },
      {
        key: 'client_login_success_title',
        description: NotificationTitles.client_login_success_title,
      },
      {
        key: 'client_banking_details_add_success_title',
        description:
          NotificationTitles.client_banking_details_add_success_title,
      },
      {
        key: 'client_profile_update_success_title',
        description: NotificationTitles.client_profile_update_success_title,
      },
      {
        key: 'clientcompliance_kyc_docs_identity_approved_title',
        description:
          NotificationTitles.clientcompliance_kyc_docs_identity_approved_title,
      },
      {
        key: 'clientcompliance_kyc_docs_address_approved_title',
        description:
          NotificationTitles.clientcompliance_kyc_docs_address_approved_title,
      },
    ];

    const labelDescriptions = labelData.map((label) => label.key);

    const labelKey = await this.labelRepository.find({
      where: {
        key: In(labelDescriptions),
      },
    });

    if (labelKey.length === 0) {
      await this.labelRepository.save(labelData);
    }

    const allLabels = await this.labelRepository.find({
      where: {
        key: In(labelDescriptions),
      },
    });

    const labelIdMap = allLabels.reduce((map, label) => {
      map[label.key] = label.id;
      return map;
    }, {});

    const labelTranslationData = [
      // English translations
      {
        langCode: 'en',
        text: 'Welcome!',
        label: { id: labelIdMap['clientregistration_signup_title'] },
      },
      {
        langCode: 'en',
        text: 'Contact Details Completed!',
        label: {
          id: labelIdMap['clientregistration_contact_details_completed_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Financial Information Completed!',
        label: {
          id: labelIdMap['clientregistration_financial_info_completed_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Experience Details Completed!',
        label: {
          id: labelIdMap['clientregistration_experience_completed_title'],
        },
      },
      {
        langCode: 'en',
        text: 'KYC Status',
        label: { id: labelIdMap['clientregistration_kyc_under_review_title'] },
      },
      {
        langCode: 'en',
        text: 'KYC Document',
        label: {
          id: labelIdMap['clientregistration_identity_document_upload_title'],
        },
      },
      {
        langCode: 'en',
        text: 'KYC Document',
        label: {
          id: labelIdMap['clientregistration_address_document_upload_title'],
        },
      },
      {
        langCode: 'en',
        text: 'KYC Document Status',
        label: {
          id: labelIdMap['clientregistration_kyc_doc_underreview_title'],
        },
      },
      {
        langCode: 'en',
        text: 'KYC Status',
        label: { id: labelIdMap['clientregistration_kyc_approved_title'] },
      },
      {
        langCode: 'en',
        text: 'KYC Status',
        label: { id: labelIdMap['clientregistration_kyc_rejected_title'] },
      },
      {
        langCode: 'en',
        text: 'KYC Status',
        label: { id: labelIdMap['clientcompliance_kyc_docs_pending_title'] },
      },
      {
        langCode: 'en',
        text: 'Live Trading Account',
        label: { id: labelIdMap['client_tradeaccount_live_create_title'] },
      },
      {
        langCode: 'en',
        text: 'Demo Trading Account',
        label: { id: labelIdMap['client_tradeaccount_demo_create_title'] },
      },
      {
        langCode: 'en',
        text: 'Deposit Transactions Status',
        label: {
          id: labelIdMap['client_deposit_byclient_request_submit_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Deposit Transactions Status',
        label: {
          id: labelIdMap['client_deposit_byclient_request_accept_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Deposit Transactions Status',
        label: {
          id: labelIdMap['client_deposit_byclient_request_reject_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Deposit Transactions Status',
        label: { id: labelIdMap['client_deposit_byclient_auto_title'] },
      },
      {
        langCode: 'en',
        text: 'Deposit Transactions Status',
        label: { id: labelIdMap['client_deposit_by_admin_approved_title'] },
      },
      {
        langCode: 'en',
        text: 'Deposit Transactions Status',
        label: { id: labelIdMap['client_deposit_byadmin_rejected_title'] },
      },
      {
        langCode: 'en',
        text: 'Withdrawal Transactions Status',
        label: {
          id: labelIdMap['client_withdraw_request_byclient_pending_title'],
        },
      },
      {
        langCode: 'en',
        text: 'KYC Document',
        label: {
          id: labelIdMap['clientregistration_payment_doc_upload_task_title'],
        },
      },
      {
        langCode: 'en',
        text: 'KYC Document Status',
        label: {
          id: labelIdMap['clientregistration_payment_doc_upload_success_title'],
        },
      },
      {
        langCode: 'en',
        text: 'KYC Document Status',
        label: {
          id: labelIdMap['clientregistration_payment_doc_approved_title'],
        },
      },
      {
        langCode: 'en',
        text: 'KYC Document Status',
        label: {
          id: labelIdMap['clientregistration_payment_doc_rejected_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Withdrawal Transactions Status',
        label: {
          id: labelIdMap['client_withdraw_request_byclient_cancelled_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Withdrawal Transactions Status',
        label: {
          id: labelIdMap['client_withdraw_request_byclient_underreview_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Withdrawal Transactions Status',
        label: {
          id: labelIdMap['client_withdraw_request_byclient_approved_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Withdrawal Transactions by Admin Status',
        label: {
          id: labelIdMap['client_withdraw_byadmin_request_underprocess_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Withdrawal Transactions by Admin Status',
        label: {
          id: labelIdMap['client_withdraw_byadmin_request_approved_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Transfer IN - OUT Transactions',
        label: {
          id: labelIdMap['client_transfer_inout_byclient_success_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Transfer IN - OUT Transactions',
        label: {
          id: labelIdMap['client_transfer_inout__byadmin_success_title'],
        },
      },
      {
        langCode: 'en',
        text: 'Credit IN Transactions',
        label: { id: labelIdMap['client_creditin_byadmin_success_title'] },
      },
      {
        langCode: 'en',
        text: 'Credit OUT Transactions',
        label: { id: labelIdMap['client_creditout_byadmin_success_title'] },
      },
      {
        langCode: 'en',
        text: 'Bonus IN Transactions',
        label: { id: labelIdMap['client_bonusin_byadmin_success_title'] },
      },
      {
        langCode: 'en',
        text: 'Bonus OUT Transactions',
        label: { id: labelIdMap['client_bonusout_byadmin_success_title'] },
      },
      {
        langCode: 'en',
        text: 'Login',
        label: { id: labelIdMap['client_login_success_title'] },
      },
      {
        langCode: 'en',
        text: 'Bank Details',
        label: { id: labelIdMap['client_banking_details_add_success_title'] },
      },
      {
        langCode: 'en',
        text: 'User Profile',
        label: { id: labelIdMap['client_profile_update_success_title'] },
      },
      {
        langCode: 'en',
        text: 'KYC Document Status',
        label: {
          id: labelIdMap['clientcompliance_kyc_docs_identity_approved_title'],
        },
      },
      {
        langCode: 'en',
        text: 'KYC Document Status',
        label: {
          id: labelIdMap['clientcompliance_kyc_docs_address_approved_title'],
        },
      },
      // Arabic translations
      {
        langCode: 'ar',
        text: 'مرحباً!',
        label: { id: labelIdMap['clientregistration_signup_title'] },
      },
      {
        langCode: 'ar',
        text: 'اكتملت تفاصيل الاتصال!',
        label: {
          id: labelIdMap['clientregistration_contact_details_completed_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'اكتملت المعلومات المالية!',
        label: {
          id: labelIdMap['clientregistration_financial_info_completed_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'تفاصيل التجربة مكتملة!',
        label: {
          id: labelIdMap['clientregistration_experience_completed_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة اعرف عميلك',
        label: { id: labelIdMap['clientregistration_kyc_under_review_title'] },
      },
      {
        langCode: 'ar',
        text: 'وثيقة اعرف عميلك',
        label: {
          id: labelIdMap['clientregistration_identity_document_upload_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'وثيقة اعرف عميلك',
        label: {
          id: labelIdMap['clientregistration_address_document_upload_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة وثيقة KYC',
        label: {
          id: labelIdMap['clientregistration_kyc_doc_underreview_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة اعرف عميلك',
        label: { id: labelIdMap['clientregistration_kyc_approved_title'] },
      },
      {
        langCode: 'ar',
        text: 'حالة اعرف عميلك',
        label: { id: labelIdMap['clientregistration_kyc_rejected_title'] },
      },
      {
        langCode: 'ar',
        text: 'حالة اعرف عميلك',
        label: { id: labelIdMap['clientcompliance_kyc_docs_pending_title'] },
      },
      {
        langCode: 'ar',
        text: 'حساب التداول المباشر',
        label: { id: labelIdMap['client_tradeaccount_live_create_title'] },
      },
      {
        langCode: 'ar',
        text: 'حساب التداول التجريبي',
        label: { id: labelIdMap['client_tradeaccount_demo_create_title'] },
      },
      {
        langCode: 'ar',
        text: 'حالة معاملات الإيداع',
        label: {
          id: labelIdMap['client_deposit_byclient_request_submit_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة معاملات الإيداع',
        label: {
          id: labelIdMap['client_deposit_byclient_request_accept_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة معاملات الإيداع',
        label: {
          id: labelIdMap['client_deposit_byclient_request_reject_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة معاملات الإيداع',
        label: { id: labelIdMap['client_deposit_byclient_auto_title'] },
      },
      {
        langCode: 'ar',
        text: 'معاملات الإيداع حسب حالة المشرف',
        label: { id: labelIdMap['client_deposit_by_admin_approved_title'] },
      },
      {
        langCode: 'ar',
        text: 'معاملات الإيداع حسب حالة المشرف',
        label: { id: labelIdMap['client_deposit_byadmin_rejected_title'] },
      },
      {
        langCode: 'ar',
        text: 'حالة معاملات السحب',
        label: {
          id: labelIdMap['client_withdraw_request_byclient_pending_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'وثيقة اعرف عميلك',
        label: {
          id: labelIdMap['clientregistration_payment_doc_upload_task_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة وثيقة KYC',
        label: {
          id: labelIdMap['clientregistration_payment_doc_upload_success_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة وثيقة KYC',
        label: {
          id: labelIdMap['clientregistration_payment_doc_approved_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة وثيقة KYC',
        label: {
          id: labelIdMap['clientregistration_payment_doc_rejected_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة معاملات السحب',
        label: {
          id: labelIdMap['client_withdraw_request_byclient_cancelled_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة معاملات السحب',
        label: {
          id: labelIdMap['client_withdraw_request_byclient_underreview_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة معاملات السحب',
        label: {
          id: labelIdMap['client_withdraw_request_byclient_approved_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'معاملات السحب حسب حالة المشرف',
        label: {
          id: labelIdMap['client_withdraw_byadmin_request_underprocess_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'معاملات السحب حسب حالة المشرف',
        label: {
          id: labelIdMap['client_withdraw_byadmin_request_approved_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'تحويل المعاملات الواردة والصادرة',
        label: {
          id: labelIdMap['client_transfer_inout_byclient_success_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'تحويل المعاملات الواردة والصادرة بواسطة المشرف',
        label: {
          id: labelIdMap['client_transfer_inout__byadmin_success_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'الائتمان في من قبل المشرف',
        label: { id: labelIdMap['client_creditin_byadmin_success_title'] },
      },
      {
        langCode: 'ar',
        text: 'الائتمان خارج من قبل المشرف',
        label: { id: labelIdMap['client_creditout_byadmin_success_title'] },
      },
      {
        langCode: 'ar',
        text: 'مكافأة في من قبل المشرف',
        label: { id: labelIdMap['client_bonusin_byadmin_success_title'] },
      },
      {
        langCode: 'ar',
        text: 'مكافأة من قبل المشرف',
        label: { id: labelIdMap['client_bonusout_byadmin_success_title'] },
      },
      {
        langCode: 'ar',
        text: 'تسجيل الدخول',
        label: { id: labelIdMap['client_login_success_title'] },
      },
      {
        langCode: 'ar',
        text: 'التفاصيل المصرفية',
        label: { id: labelIdMap['client_banking_details_add_success_title'] },
      },
      {
        langCode: 'ar',
        text: 'ملف تعريفي للمستخدم',
        label: { id: labelIdMap['client_profile_update_success_title'] },
      },
      {
        langCode: 'ar',
        text: 'حالة وثيقة هوية KYC',
        label: {
          id: labelIdMap['clientcompliance_kyc_docs_identity_approved_title'],
        },
      },
      {
        langCode: 'ar',
        text: 'حالة وثيقة الإقامة KYC',
        label: {
          id: labelIdMap['clientcompliance_kyc_docs_address_approved_title'],
        },
      },
    ];

    const labelTransaltion = await this.labelTranslationRepository.find({
      where: {
        text: In(labelDescriptions),
      },
    });

    if (labelTransaltion.length === 0) {
      await this.labelTranslationRepository.save(labelTranslationData);
    }
  }
}
