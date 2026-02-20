import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterEmailVariable1750333757978 implements MigrationInterface {
    name = 'AlterEmailVariable1750333757978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_variable" ADD "is_external" bit NOT NULL CONSTRAINT "DF_ef73b50021fdc92e0c1bcd84261" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_variable" DROP CONSTRAINT "DF_ef73b50021fdc92e0c1bcd84261"`);
        await queryRunner.query(`ALTER TABLE "email_variable" DROP COLUMN "is_external"`);
    }

}
