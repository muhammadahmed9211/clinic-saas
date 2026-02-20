import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedErrorMsgInTransactionEvents1733228788166 implements MigrationInterface {
    name = 'AddedErrorMsgInTransactionEvents1733228788166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_events" ADD "errorMsg" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_events" DROP COLUMN "errorMsg"`);
    }

}
