import { MigrationInterface, QueryRunner } from "typeorm";

export class DuplicateLead1745331082904 implements MigrationInterface {
    name = 'DuplicateLead1745331082904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" ADD "isDuplicated" bit NOT NULL CONSTRAINT "DF_36a69b8f272d46c5b1e4d364f59" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "isDuplicated"`);
    }

}
