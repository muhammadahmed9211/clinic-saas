import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedConfigInTransactionMethodRegulation1742374065948 implements MigrationInterface {
    name = 'AddedConfigInTransactionMethodRegulation1742374065948'

    public async up(queryRunner: QueryRunner): Promise<void> {	
        await queryRunner.query(`ALTER TABLE "transaction_method_regulations" ADD "config" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_method_regulations" DROP COLUMN "config"`);
    }

}
