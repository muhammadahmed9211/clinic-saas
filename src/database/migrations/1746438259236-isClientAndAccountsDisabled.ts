import { MigrationInterface, QueryRunner } from "typeorm";

export class IsClientAndAccountsDisabled1746438259236 implements MigrationInterface {
    name = 'IsClientAndAccountsDisabled1746438259236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "isClientAndAccountsDisabled" bit NOT NULL CONSTRAINT "DF_4b33f104927a0cdca5116f26ed6" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isClientAndAccountsDisabled"`);
    }

}
