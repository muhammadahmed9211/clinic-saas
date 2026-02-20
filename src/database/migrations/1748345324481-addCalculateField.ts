import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCalculateField1748345324481 implements MigrationInterface {
    name = 'AddCalculateField1748345324481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner" ADD "calculate_commission" bit NOT NULL CONSTRAINT "DF_2fb3ed8fa071d5a8e78bbb6d2b7" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "calculate_commission"`);
    }

}
