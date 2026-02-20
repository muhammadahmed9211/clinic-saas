import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAccountTypeInTransaction1740226397763 implements MigrationInterface {
    name = 'AddedAccountTypeInTransaction1740226397763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "accountType" varchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "accountType"`);
    }

}