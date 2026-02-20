import { MigrationInterface, QueryRunner } from "typeorm";

export class LayoutAlter1728716876591 implements MigrationInterface {
    name = 'LayoutAlter1728716876591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" ADD "regulation" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" DROP COLUMN "regulation"`);
    }

}
