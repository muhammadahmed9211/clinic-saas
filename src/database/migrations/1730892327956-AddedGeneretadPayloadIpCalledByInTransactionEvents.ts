import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedGeneretadPayloadIpCalledByInTransactionEvents1730892327956 implements MigrationInterface {
    name = 'AddedGeneretadPayloadIpCalledByInTransactionEvents1730892327956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_events" ADD "generatedPayload" text`);
        await queryRunner.query(`ALTER TABLE "transaction_events" ADD "calledBy" text`);
        await queryRunner.query(`ALTER TABLE "transaction_events" ADD "ip" text`);
        await queryRunner.query(`ALTER TABLE "transaction_events" ADD "responseBody" text`);
        await queryRunner.query(`ALTER TABLE "transaction_events" ADD "isProcessed" bit`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_events" DROP COLUMN "ip"`);
        await queryRunner.query(`ALTER TABLE "transaction_events" DROP COLUMN "calledBy"`);
        await queryRunner.query(`ALTER TABLE "transaction_events" DROP COLUMN "generatedPayload"`);
        await queryRunner.query(`ALTER TABLE "transaction_events" DROP COLUMN "isProcessed"`);
        await queryRunner.query(`ALTER TABLE "transaction_events" DROP COLUMN "responseBody"`);
    }

}
