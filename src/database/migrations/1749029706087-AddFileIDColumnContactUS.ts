import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileIDColumnContactUS1749029706087 implements MigrationInterface {
    name = 'AddFileIDColumnContactUS1749029706087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" ADD "fileId" uniqueidentifier`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" DROP COLUMN "fileId"`);
    }

}
