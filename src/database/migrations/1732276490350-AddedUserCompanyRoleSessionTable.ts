import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedClientRemarksInTransaction implements MigrationInterface {
    name = 'AddedClientRemarksInTransaction'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "clientRemarks" nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "clientRemarks"`);
    }

}
