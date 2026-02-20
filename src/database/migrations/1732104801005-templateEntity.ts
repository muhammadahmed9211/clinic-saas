import { MigrationInterface, QueryRunner } from "typeorm";

export class TemplateEntity1732104801005 implements MigrationInterface {
    name = 'TemplateEntity1732104801005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "UQ_d83776875e35b8fa06020fc1c52"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "deletedAt" datetime2`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "UQ_a1984a7a04b1930afd0071eed95" UNIQUE ("name", "language", "domain", "deletedAt", "isDeleted")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "UQ_a1984a7a04b1930afd0071eed95"`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "UQ_d83776875e35b8fa06020fc1c52" UNIQUE ("domain", "language", "name")`);
    }

}
