import { MigrationInterface, QueryRunner } from "typeorm";

export class PerformanceTarget1749543509002 implements MigrationInterface {
    name = 'PerformanceTarget1749543509002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity_reports" ADD "target" float NOT NULL CONSTRAINT "DF_e7efd5a152fa73803ad2445c74e" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity_reports" DROP CONSTRAINT "DF_e7efd5a152fa73803ad2445c74e"`);
        await queryRunner.query(`ALTER TABLE "activity_reports" DROP COLUMN "target"`);
    }

}
