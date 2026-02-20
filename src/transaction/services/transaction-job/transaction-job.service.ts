import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "src/config/config.type";
import { TransactionStatus, TransactionType } from "src/transaction/entities/transaction.entity";
import { TransactionRepository } from "src/transaction/repositories/transaction.repository";
import { LessThanOrEqual } from "typeorm";

@Injectable()
export class TransactionJobService {
    constructor(private readonly transactionRepository: TransactionRepository, private readonly configService: ConfigService<AllConfigType>) { }

    async markNotPaidStatusToPendingTransaction() {
        const difference = this.configService.getOrThrow(
            'app.transactionNotPaidDifference',
            {
                infer: true,
            },
        );

        try {
            if (difference > 0) {
                const createdAt = new Date(Date.now() - difference);
                const { affected } = await this.transactionRepository.update({
                    type: TransactionType.DEPOSIT,
                    status: TransactionStatus.INITIALIZED_NOT_PAID,
                    isManual: false,
                    createdAt: LessThanOrEqual(createdAt)
                }, {
                    status: TransactionStatus.NOT_PAID
                })
                console.log(affected , "TRANSACTION status updated to not paid")
            }
        } catch (error) {
            console.error(error)
        }
    }
}
