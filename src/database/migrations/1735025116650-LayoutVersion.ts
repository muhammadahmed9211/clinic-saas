import { MigrationInterface, QueryRunner } from "typeorm";

export class LayoutVersion1735025116650 implements MigrationInterface {
    name = 'LayoutVersion1735025116650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" ADD "version" nvarchar(255) NOT NULL CONSTRAINT "DF_d33da2fffcc5861499904a16b58" DEFAULT 'v1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" DROP COLUMN "version"`);
    }

}
