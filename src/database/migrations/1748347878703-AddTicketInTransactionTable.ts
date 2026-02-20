import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTicketInTransactionTable1748347878703 implements MigrationInterface {
    name = 'AddTicketInTransactionTable1748347878703'

    public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`ALTER TABLE "transaction" ADD "ticket" varchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "ticket"`);
    }

}
