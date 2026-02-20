import { MigrationInterface, QueryRunner } from "typeorm";

export class LayoutUniqueConstraintAdded1732104280256 implements MigrationInterface {
    name = 'LayoutUniqueConstraintAdded1732104280256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" ADD CONSTRAINT "UQ_837861749b4aa22054a95b56e07" UNIQUE ("regulation", "language", "companyName", "deletedAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" DROP CONSTRAINT "UQ_837861749b4aa22054a95b56e07"`);
    }

}
