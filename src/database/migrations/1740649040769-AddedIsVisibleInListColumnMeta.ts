import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsVisibleInListColumnMeta1740649040769 implements MigrationInterface {
    name = 'AddedIsVisibleInListColumnMeta1740649040769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_columns_meta" ADD "isVisible" bit NOT NULL CONSTRAINT "DF_7adb888cced5ec6ca2c399f5045" DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_columns_meta" DROP COLUMN "isVisible"`);
    }

}
