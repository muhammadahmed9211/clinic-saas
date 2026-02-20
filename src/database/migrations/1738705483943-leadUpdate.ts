import { MigrationInterface, QueryRunner } from "typeorm";

export class LeadUpdate1738705483943 implements MigrationInterface {
    name = 'LeadUpdate1738705483943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" ADD "latestNote" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "lead" ADD "lastNoteAt" datetime`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "lastNoteAt"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "latestNote"`);
    }

}
