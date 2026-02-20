import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationMessages } from 'src/notification/constants/notification.messages';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class addNotificationsSeedService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    @InjectRepository(LabelTranslation)
    private labelTranslationRepository: Repository<LabelTranslation>,
  ) {}

  async run() {
    const labelData = [
      {
        key: 'clientregistration_signup',
        description: NotificationMessages.clientregistration_signup,
      },
      {
        key: 'clientregistration_contact_details',
        description: NotificationMessages.clientregistration_contact_details,
      },
      {
        key: 'clientregistration_financial_info',
        description: NotificationMessages.clientregistration_financial_info,
      },
      {
        key: 'clientregistration_expereince_kycdocs',
        description: NotificationMessages.clientregistration_expereince_kycdocs,
      },
      {
        key: 'clientregistration_kyc_under_review',
        description: NotificationMessages.clientregistration_kyc_under_review,
      },
      {
        key: 'clientregistration_identity_document_upload',
        description:
          NotificationMessages.clientregistration_identity_document_upload,
      },
      {
        key: 'clientregistration_address_document_upload',
        description:
          NotificationMessages.clientregistration_address_document_upload,
      },
      {
        key: 'clientregistration_kyc_documents_underreview',
        description:
          NotificationMessages.clientregistration_kyc_documents_underreview,
      },
      {
        key: 'clientregistration_kyc_approved',
        description: NotificationMessages.clientregistration_kyc_approved,
      },
      {
        key: 'clientregistration_kyc_rejected',
        description: NotificationMessages.clientregistration_kyc_rejected,
      },
      {
        key: 'clientcompliance_kyc_docs_pending',
        description: NotificationMessages.clientcompliance_kyc_docs_pending,
      },
      {
        key: 'client_tradeaccount_live_create',
        description: NotificationMessages.client_tradeaccount_live_create,
      },
      {
        key: 'client_tradeaccount_demo_create',
        description: NotificationMessages.client_tradeaccount_demo_create,
      },
      {
        key: 'client_deposit_byclient_request_submit',
        description:
          NotificationMessages.client_deposit_byclient_request_submit,
      },
      {
        key: 'client_deposit_byclient_request_accept',
        description:
          NotificationMessages.client_deposit_byclient_request_accept,
      },
      {
        key: 'client_deposit_byclient_request_reject',
        description:
          NotificationMessages.client_deposit_byclient_request_reject,
      },
      {
        key: 'client_deposit_byclient_auto',
        description: NotificationMessages.client_deposit_byclient_auto,
      },
      {
        key: 'client_deposit_by_admin_approved',
        description: NotificationMessages.client_deposit_by_admin_approved,
      },
      {
        key: 'client_deposit_byadmin_rejected',
        description: NotificationMessages.client_deposit_byadmin_rejected,
      },
      {
        key: 'client_withdraw_request_byclient_pending',
        description:
          NotificationMessages.client_withdraw_request_byclient_pending,
      },
      {
        key: 'clientregistration_payment_doc_upload_task',
        description:
          NotificationMessages.clientregistration_payment_doc_upload_task,
      },
      {
        key: 'clientregistration_payment_doc_upload_success',
        description:
          NotificationMessages.clientregistration_payment_doc_upload_success,
      },
      {
        key: 'clientregistration_payment_doc_approved',
        description:
          NotificationMessages.clientregistration_payment_doc_approved,
      },
      {
        key: 'clientregistration_payment_doc_rejected',
        description:
          NotificationMessages.clientregistration_payment_doc_rejected,
      },
      {
        key: 'client_withdraw_request_byclient_cancelled',
        description:
          NotificationMessages.client_withdraw_request_byclient_cancelled,
      },
      {
        key: 'client_withdraw_request_byclient_underreview',
        description:
          NotificationMessages.client_withdraw_request_byclient_underreview,
      },
      {
        key: 'client_withdraw_request_byclient_approved',
        description:
          NotificationMessages.client_withdraw_request_byclient_approved,
      },
      {
        key: 'client_withdraw_byadmin_request_underprocess',
        description:
          NotificationMessages.client_withdraw_byadmin_request_underprocess,
      },
      {
        key: 'client_withdraw_byadmin_request_approved',
        description:
          NotificationMessages.client_withdraw_byadmin_request_approved,
      },
      {
        key: 'client_transfer_inout_byclient_success',
        description:
          NotificationMessages.client_transfer_inout_byclient_success,
      },
      {
        key: 'client_transfer_inout__byadmin_success',
        description:
          NotificationMessages.client_transfer_inout__byadmin_success,
      },
      {
        key: 'client_creditin_byadmin_success',
        description: NotificationMessages.client_creditin_byadmin_success,
      },
      {
        key: 'client_creditout_byadmin_success',
        description: NotificationMessages.client_creditout_byadmin_success,
      },
      {
        key: 'client_bonusin_byadmin_success',
        description: NotificationMessages.client_bonusin_byadmin_success,
      },
      {
        key: 'client_bonusout_byadmin_success',
        description: NotificationMessages.client_bonusout_byadmin_success,
      },
      {
        key: 'client_login_success',
        description: NotificationMessages.client_login_success,
      },
      {
        key: 'client_banking_details_add_success',
        description: NotificationMessages.client_banking_details_add_success,
      },
      {
        key: 'client_profile_update_success',
        description: NotificationMessages.client_profile_update_success,
      },
      {
        key: 'clientcompliance_kyc_docs_identity_approved',
        description:
          NotificationMessages.clientcompliance_kyc_docs_identity_approved,
      },
      {
        key: 'clientcompliance_kyc_docs_address_approved',
        description:
          NotificationMessages.clientcompliance_kyc_docs_address_approved,
      },
    ];

    const labelDescriptions = labelData.map((label) => label.description);

    const labelKey = await this.labelRepository.find({
      where: {
        description: In(labelDescriptions),
      },
    });

    if (labelKey.length === 0) {
      await this.labelRepository.save(labelData);
    }

    const allLabels = await this.labelRepository.find({
      where: {
        description: In(labelDescriptions),
      },
    });

    const labelIdMap = allLabels.reduce((map, label) => {
      map[label.description] = label.id;
      return map;
    }, {});

    const labelTranslationData = [
      // English translations
      {
        langCode: 'en',
        text: 'Welcome to your Client Account',
        label: { id: labelIdMap['Welcome to your Client Account'] },
      },
      {
        langCode: 'en',
        text: 'Contact Details completed successfully',
        label: { id: labelIdMap['Contact Details completed successfully'] },
      },
      {
        langCode: 'en',
        text: 'Financial Details completed successfully',
        label: { id: labelIdMap['Financial Details completed successfully'] },
      },
      {
        langCode: 'en',
        text: 'Experience Details & KYC Documents completed successfully',
        label: {
          id: labelIdMap[
            'Experience Details & KYC Documents completed successfully'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'We have received your KYC details, and they are under review. The approval process may take up to 48 hours.',
        label: {
          id: labelIdMap[
            'We have received your KYC details, and they are under review. The approval process may take up to 48 hours.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Identity Proof Document saved successfully',
        label: { id: labelIdMap['Identity Proof Document saved successfully'] },
      },
      {
        langCode: 'en',
        text: 'Address Proof Document saved successfully',
        label: { id: labelIdMap['Address Proof Document saved successfully'] },
      },
      {
        langCode: 'en',
        text: 'We have received your KYC document details, and they are under review. The approval process may take up to 48 hours.',
        label: {
          id: labelIdMap[
            'We have received your KYC document details, and they are under review. The approval process may take up to 48 hours.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Your KYC status is approved. Your account is ready for trading.',
        label: {
          id: labelIdMap[
            'Your KYC status is approved. Your account is ready for trading.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Your KYC Documents are Rejected. Please check your email for further details.',
        label: {
          id: labelIdMap[
            'Your KYC Documents are Rejected. Please check your email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Your trading account is pending the upload of KYC documents. Your account may be subject to limitations.',
        label: {
          id: labelIdMap[
            'Your trading account is pending the upload of KYC documents. Your account may be subject to limitations.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Your live trading account has been created. You can now start trading.',
        label: {
          id: labelIdMap[
            'Your live trading account has been created. You can now start trading.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Your Demo Trading account has been created. You can start Demo Trading now.',
        label: {
          id: labelIdMap[
            'Your Demo Trading account has been created. You can start Demo Trading now.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Please Note! Your Deposit request is Under Process. It may take up to 48 hours for Approval.',
        label: {
          id: labelIdMap[
            'Please Note! Your Deposit request is Under Process. It may take up to 48 hours for Approval.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Your Deposit request is Approved! Please check your balance. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'Your Deposit request is Approved! Please check your balance. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Your Deposit request is Rejected! Please check your Email for further details.',
        label: {
          id: labelIdMap[
            'Your Deposit request is Rejected! Please check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Successful Deposit. Please check your balance. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'Successful Deposit. Please check your balance. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Please Note! A Deposit has been made for you. Please check your balance. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'Please Note! A Deposit has been made for you. Please check your balance. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Please Note! Your Deposit receipt is Rejected! Please check your Email for further details.',
        label: {
          id: labelIdMap[
            'Please Note! Your Deposit receipt is Rejected! Please check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Your Withdrawal request is Pending. It may take up to 48 hours for Approval.',
        label: {
          id: labelIdMap[
            'Your Withdrawal request is Pending. It may take up to 48 hours for Approval.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Please Note! Upload your Proof of Payment Document to move further with Withdrawal.',
        label: {
          id: labelIdMap[
            'Please Note! Upload your Proof of Payment Document to move further with Withdrawal.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Proof of Payment Document saved successfully',
        label: {
          id: labelIdMap['Proof of Payment Document saved successfully'],
        },
      },
      {
        langCode: 'en',
        text: 'Your Proof of Payment document is Approved.',
        label: {
          id: labelIdMap['Your Proof of Payment document is Approved.'],
        },
      },
      {
        langCode: 'en',
        text: 'Please note! Your Proof of Payment got Rejected. Please check your Email for further details.',
        label: {
          id: labelIdMap[
            'Please note! Your Proof of Payment got Rejected. Please check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Withdrawal request cancelled.',
        label: { id: labelIdMap['Withdrawal request cancelled.'] },
      },
      {
        langCode: 'en',
        text: 'Your Withdrawal request is Under Progress. Please Note, you cannot cancel it now.',
        label: {
          id: labelIdMap[
            'Your Withdrawal request is Under Progress. Please Note, you cannot cancel it now.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Your Withdrawal request is Approved. Check Email for further details.',
        label: {
          id: labelIdMap[
            'Your Withdrawal request is Approved. Check Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Please Note! A Withdrawal request has been made for you & is Under Process. It may take up to 48 hours for Approval.',
        label: {
          id: labelIdMap[
            'Please Note! A Withdrawal request has been made for you & is Under Process. It may take up to 48 hours for Approval.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Please Note! A Withdrawal request made for you is Approved. Please check your balance. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'Please Note! A Withdrawal request made for you is Approved. Please check your balance. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Successfully Transferred. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'Successfully Transferred. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'A Transfer In-Out transaction has been made for you. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'A Transfer In-Out transaction has been made for you. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'A Credit In transaction has been made for you. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'A Credit In transaction has been made for you. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'A Credit Out transaction has been made for you. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'A Credit Out transaction has been made for you. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'A Bonus In transaction has been made for you. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'A Bonus In transaction has been made for you. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'A Bonus Out transaction has been made for you. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'A Bonus Out transaction has been made for you. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Successfully Logged in.',
        label: { id: labelIdMap['Successfully Logged in.'] },
      },
      {
        langCode: 'en',
        text: 'Successfully added Bank Details.',
        label: { id: labelIdMap['Successfully added Bank Details.'] },
      },
      {
        langCode: 'en',
        text: 'Successfully Updated Profile',
        label: { id: labelIdMap['Successfully Updated Profile'] },
      },
      {
        langCode: 'en',
        text: 'Your KYC Proof of Identity has been approved. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'Your KYC Proof of Identity has been approved. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'en',
        text: 'Your KYC Proof of Address has been approved. Check your Email for further details.',
        label: {
          id: labelIdMap[
            'Your KYC Proof of Address has been approved. Check your Email for further details.'
          ],
        },
      },
      // Arabic translations
      {
        langCode: 'ar',
        text: 'مرحبًا بك في حسا بك الخاص',
        label: { id: labelIdMap['Welcome to your Client Account'] },
      },
      {
        langCode: 'ar',
        text: 'لقد تم تحديث تفاصيل الاتصال بنجاح',
        label: { id: labelIdMap['Contact Details completed successfully'] },
      },
      {
        langCode: 'ar',
        text: 'لقد تم تحديث التفاصيل المالية بنجاح',
        label: { id: labelIdMap['Financial Details completed successfully'] },
      },
      {
        langCode: 'ar',
        text: 'لقد تم تحديث تفاصيل الخبرة ومستندات "معرفة عميلك" بنجاح',
        label: {
          id: labelIdMap[
            'Experience Details & KYC Documents completed successfully'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'لقد تلقينا تفاصيل و مستندات "معرفة عميلك"  الخاصة بك، وهي قيد المراجعة. قد تستغرق عملية الموافقة ما يصل إلى 48 ساعة كحد اقصى',
        label: {
          id: labelIdMap[
            'We have received your KYC details, and they are under review. The approval process may take up to 48 hours.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'لقد تم حفظ مستند إثبات الهوية بنجاح',
        label: { id: labelIdMap['Identity Proof Document saved successfully'] },
      },
      {
        langCode: 'ar',
        text: 'لقد تم تم حفظ مستندات إثبات العنوان بنجاح',
        label: { id: labelIdMap['Address Proof Document saved successfully'] },
      },
      {
        langCode: 'ar',
        text: 'لقد تلقينا مستندات "معرفة عميلك"  الخاصة بك، وهي قيد المراجعة. قد تستغرق عملية الموافقة ما يصل إلى 48 ساعة كحد اقصى',
        label: {
          id: labelIdMap[
            'We have received your KYC document details, and they are under review. The approval process may take up to 48 hours.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'لقد تمت الموافقة على مستندات  "معرفة عميلك" الخاصة بك. يمكنك التداول الآن',
        label: {
          id: labelIdMap[
            'Your KYC status is approved. Your account is ready for trading.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'لقد تم رفض مستندات  "معرفة عميلك" الخاصة بك. يرجى مراجعة بريدك الإلكتروني لمزيد من التفاصيل',
        label: {
          id: labelIdMap[
            'Your KYC Documents are Rejected. Please check your email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'حساب التداول الخاص بك في حالة انتظار للتحققق من مستندات "معرفة عميلك" لخاصة بك. قد يؤدي الفشل في تحميل هذه المستندات إلى فرض قيود على حسابك.',
        label: {
          id: labelIdMap[
            'Your trading account is pending the upload of KYC documents. Your account may be subject to limitations.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'لقد تم إنشاء حساب تداول  خاص بك مباشز. يمكنك البدء بالتداول.',
        label: {
          id: labelIdMap[
            'Your live trading account has been created. You can now start trading.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'لقد تم إنشاء حساب التداول التجريبي الخاص بك. يمكنك بدء التداول التجريبي الآن.',
        label: {
          id: labelIdMap[
            'Your Demo Trading account has been created. You can start Demo Trading now.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! طلب الإيداع الخاص بك قيد المعالجة. قد يستغرق الأمر ما يصل إلى 48 ساعة للموافقة.',
        label: {
          id: labelIdMap[
            'Please Note! Your Deposit request is Under Process. It may take up to 48 hours for Approval.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'تمت الموافقة على إيداع الطلب الخاص بك! يرجى التحقق من رصيدك. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'Your Deposit request is Approved! Please check your balance. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'تم رفض طلب الإيداع الخاص بك! يرجى التحقق من البريد الإلكتروني الخاص بك لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'Your Deposit request is Rejected! Please check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'الإيداع الناجح. يرجى التحقق من رصيدك. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'Successful Deposit. Please check your balance. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! لقد تم عمل إيداع لك. يرجى التحقق من رصيدك. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'Please Note! A Deposit has been made for you. Please check your balance. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! تم رفض إيصال الإيداع الخاص بك! يرجى التحقق من البريد الإلكتروني الخاص بك لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'Please Note! Your Deposit receipt is Rejected! Please check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'طلب السحب الخاص بك معلق. قد يستغرق الأمر ما يصل إلى 48 ساعة للموافقة.',
        label: {
          id: labelIdMap[
            'Your Withdrawal request is Pending. It may take up to 48 hours for Approval.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! قم بتحميل مستند إثبات الدفع الخاص بك للمضي قدمًا في عملية السحب.',
        label: {
          id: labelIdMap[
            'Please Note! Upload your Proof of Payment Document to move further with Withdrawal.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'تم حفظ مستند إثبات الدفع بنجاح',
        label: {
          id: labelIdMap['Proof of Payment Document saved successfully'],
        },
      },
      {
        langCode: 'ar',
        text: 'تمت الموافقة على مستند إثبات الدفع الخاص بك.',
        label: {
          id: labelIdMap['Your Proof of Payment document is Approved.'],
        },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! تم رفض إثبات الدفع الخاص بك. يرجى التحقق من البريد الإلكتروني الخاص بك لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'Please note! Your Proof of Payment got Rejected. Please check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'تم إلغاء طلب السحب.',
        label: { id: labelIdMap['Withdrawal request cancelled.'] },
      },
      {
        langCode: 'ar',
        text: 'طلب السحب الخاص بك قيد التقدم. يرجى ملاحظة أنه لا يمكنك إلغاءه الآن.',
        label: {
          id: labelIdMap[
            'Your Withdrawal request is Under Progress. Please Note, you cannot cancel it now.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'تمت الموافقة على طلب السحب الخاص بك. تحقق من البريد الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'Your Withdrawal request is Approved. Check Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! لقد تم تقديم طلب سحب لك وهو قيد المعالجة. قد يستغرق الأمر ما يصل إلى 48 ساعة للموافقة.',
        label: {
          id: labelIdMap[
            'Please Note! A Withdrawal request has been made for you & is Under Process. It may take up to 48 hours for Approval.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'يرجى الملاحظة! تمت الموافقة على طلب السحب المقدم لك. يرجى التحقق من رصيدك. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'Please Note! A Withdrawal request made for you is Approved. Please check your balance. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'تم النقل بنجاح. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'Successfully Transferred. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'لقد تم إجراء معاملة تحويل من الداخل إلى الخارج نيابةً عنك. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'A Transfer In-Out transaction has been made for you. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'لقد تم عمل رصيد في المعاملة لك. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'A Credit In transaction has been made for you. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'تم إجراء معاملة ائتمان خارجية لك. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'A Credit Out transaction has been made for you. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'لقد تم تقديم مكافأة في المعاملة لك. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'A Bonus In transaction has been made for you. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'تم إجراء معاملة مكافأة لك. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'A Bonus Out transaction has been made for you. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'تم تسجيل الدخول بنجاح.',
        label: { id: labelIdMap['Successfully Logged in.'] },
      },
      {
        langCode: 'ar',
        text: 'تمت إضافة تفاصيل البنك بنجاح.',
        label: { id: labelIdMap['Successfully added Bank Details.'] },
      },
      {
        langCode: 'ar',
        text: 'تم تحديث الملف الشخصي بنجاح',
        label: { id: labelIdMap['Successfully Updated Profile'] },
      },
      {
        langCode: 'ar',
        text: 'تمت الموافقة على إثبات هوية KYC الخاص بك. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'Your KYC Proof of Identity has been approved. Check your Email for further details.'
          ],
        },
      },
      {
        langCode: 'ar',
        text: 'تمت الموافقة على إثبات عنوان KYC الخاص بك. تحقق من بريدك الإلكتروني لمزيد من التفاصيل.',
        label: {
          id: labelIdMap[
            'Your KYC Proof of Address has been approved. Check your Email for further details.'
          ],
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
