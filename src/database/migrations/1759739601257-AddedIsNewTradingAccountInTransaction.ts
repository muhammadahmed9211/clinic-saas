import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsNewTradingAccountInTransaction1759739601257 implements MigrationInterface {
    name = 'AddedIsNewTradingAccountInTransaction1759739601257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "isNewTradingAccount" bit NOT NULL CONSTRAINT "DF_7eec3bcc716d1b685498fdd7c93" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isNewTradingAccount"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "DF_7eec3bcc716d1b685498fdd7c93"`);
    }

}
