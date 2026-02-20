import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import {
  NotificationMessages,
  NotificationTitles,
} from 'src/notification/constants/notification.messages';
import { NotificationService } from 'src/notification/notification.service';
import { Label } from 'src/tasks/entities/label.entity';
import { Transaction, TransactionStatus } from 'src/transaction/entities/transaction.entity';
import { Repository } from 'typeorm';

interface ICreateTransactionNotification {
  transaction: Transaction;
  labelTitle: NotificationTitles;
  label: NotificationMessages;
  admin_description: string;
  userId?:number
}

@Injectable()
export class TransactionNotificationService {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) { }

  promisefy(promise: Promise<any>) {
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    promise.then().catch();
  }

  async create(data: ICreateTransactionNotification) {
    try {
      const { label, labelTitle } = data;
      let { admin_description } = data;
      const entity_id = data.transaction.id;
      const tr = await this.transactionRepository.findOne({
        where: { id: entity_id },
        loadEagerRelations: false,
        relations: ['user'],
      });

      if (!tr || !tr.user) {
        return;
      }

      const userId = tr.user.id;

      const labelEntity = await this.labelRepository.findOne({
        where: { description: label },
      });

      const labelTitleEntity = await this.labelRepository.findOne({
        where: {
          description: labelTitle,
        },
      });

      const operator = await this.operatorRepository.findOne({
        where: { full_name: 'System' },
      });


      const link = `${process.env.CRM_FRONT_END_URL}/clients/${userId}?fid=${entity_id}`;
      const clientLink = `${process.env.CRM_FRONT_END_URL}/clients/${userId}`;

      if (admin_description !== 'N/A') {
        if (admin_description && clientLink) {
          const clientURL = `\nClient ID : ${clientLink}`
          admin_description = admin_description + clientURL
        }

        if (admin_description && tr.amount) {
          const trAmount = `\nAmount : ${tr.amount}`
          admin_description = admin_description + trAmount
        }

        if (admin_description && tr.type) {
          const trType = `\nType : ${tr.type}`
          admin_description = admin_description + trType
        }

        // if (admin_description && link) {
        //   const trLink = `\nClick to see : ${link}`
        //   admin_description = admin_description + trLink
        // }
      }

      if (labelEntity && labelTitleEntity && operator && tr.user) {
        const notificationData = {
          entity_id,
          entity_name: 'transaction',
          title_label_id: labelTitleEntity.id,
          description_label_id: labelEntity.id,
          created_by: 'system',
          is_read: false,
          is_deleted: false,
          user_id: data?.userId || userId,
          creator_id: operator?.id,
          admin_description: admin_description !== 'N/A' ? admin_description : undefined,
          link,
        };
        await this.notificationService.createNotification({
          ...notificationData,
          title: labelTitleEntity?.description,
          description: labelEntity?.description,
        });
      }
    } catch (error) {
      console.error(error)
    }
  }

  clientManualTransactionNotification(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_deposit_byclient_request_submit,
      labelTitle:
        NotificationTitles.client_deposit_byclient_request_submit_title,
      admin_description: "Review Transaction"
    };
    this.promisefy(this.create(notificationData));
  }

  automaticTransactionApproved(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_deposit_byclient_auto,
      labelTitle: NotificationTitles.client_deposit_byclient_auto_title,
      admin_description: "Transaction Added"
    };
    this.promisefy(this.create(notificationData));
  }

  manualDepositByAdmin(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_deposit_by_admin_approved,
      labelTitle: NotificationTitles.client_deposit_by_admin_approved_title,
      admin_description: "Transaction Approved"
    };
    this.promisefy(this.create(notificationData));
  }

  clientWithdrawRequest(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_withdraw_request_byclient_pending,
      labelTitle:
        NotificationTitles.client_withdraw_request_byclient_pending_title,
      admin_description: 'Review Transaction'
    };
    this.promisefy(this.create(notificationData));
  }

  cancelClientWithdrawRequest(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_withdraw_request_byclient_cancelled,
      labelTitle:
        NotificationTitles.client_withdraw_request_byclient_cancelled_title,
      admin_description: "Transaction Cancelled"
    };
    this.promisefy(this.create(notificationData));
  }

  withdrawRequestApprovedByAdmin(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_withdraw_request_byclient_approved,
      labelTitle:
        NotificationTitles.client_withdraw_request_byclient_approved_title,
      admin_description: 'Transaction Approved'
    };
    this.promisefy(this.create(notificationData));
  }
  depositRequestApprovedByAdmin(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_deposit_byclient_request_accept,
      labelTitle:
        NotificationTitles.client_deposit_byclient_request_accept_title,
      admin_description: 'Transaction Approved',
    };
    this.promisefy(this.create(notificationData));
  }

  depositRequestRejectedByAdmin(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_deposit_byclient_request_reject,
      labelTitle: NotificationTitles.client_deposit_byclient_request_reject_title,
      admin_description: "Transaction Rejected"
    };
    this.promisefy(this.create(notificationData));
  }

  withdrawRequestByAdmin(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_withdraw_byadmin_request_approved,
      labelTitle:
        NotificationTitles.client_withdraw_byadmin_request_approved_title,
      admin_description: "Transaction Added"
    };
    this.promisefy(this.create(notificationData));
  }

  transferByAdmin(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_transfer_inout__byadmin_success,
      labelTitle:
        NotificationTitles.client_transfer_inout__byadmin_success_title,
      admin_description: "Transaction Successful"
    };
    this.promisefy(this.create(notificationData));
  }

  transferByUser(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_transfer_inout_byclient_success,
      labelTitle:
        NotificationTitles.client_transfer_inout_byclient_success_title,
      admin_description: "Transaction Successful"
    };
    this.promisefy(this.create(notificationData));
  }

  creditIn(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_creditin_byadmin_success,
      labelTitle: NotificationTitles.client_creditin_byadmin_success_title,
      admin_description: "Transaction Successful"
    };
    this.promisefy(this.create(notificationData));
  }

  creditOut(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_creditout_byadmin_success,
      labelTitle: NotificationTitles.client_creditout_byadmin_success_title,
      admin_description: "Transaction Successful"
    };
    this.promisefy(this.create(notificationData));
  }

  bonusIn(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_bonusin_byadmin_success,
      labelTitle: NotificationTitles.client_bonusin_byadmin_success_title,
      admin_description: "Transaction Successful"
    };
    this.promisefy(this.create(notificationData));
  }

  bonusOut(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.client_bonusout_byadmin_success,
      labelTitle: NotificationTitles.client_bonusout_byadmin_success_title,
      admin_description: "Transaction Successful"
    };
    this.promisefy(this.create(notificationData));
  }

  salesRepDepositCreate(transaction: Transaction) {
    let admin_description = "Review Transaction"
    if(transaction.status === TransactionStatus.APPROVED){
      admin_description = "Transaction Approved"
    }
    const notificationData = {
      transaction,
      label: NotificationMessages.sales_agent_deposit_creation,
      labelTitle: NotificationTitles.sales_agent_deposit_creation_title,
      admin_description: "Review Transaction",
      userId:transaction?.user?.id
    };
    this.promisefy(this.create(notificationData));
  }

  salesRepWithdrawalCreate(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.sales_agent_withdrawal_creation,
      labelTitle: NotificationTitles.sales_agent_withdrawal_creation_title,
      admin_description: "Review Transaction",
      userId:transaction?.user?.id
    };
    this.promisefy(this.create(notificationData));
  }

  salesRepDepositApprove(transaction: Transaction) {
    const notificationData = {
      transaction,
      label: NotificationMessages.sales_agent_deposit_approved,
      labelTitle: NotificationTitles.sales_agent_deposit_approved_title,
      admin_description: "Transaction Approved",
      userId:transaction?.user?.id
    };
    this.promisefy(this.create(notificationData));
  }
}
