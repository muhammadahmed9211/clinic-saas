import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserTable1736088461999 implements MigrationInterface {
    name = 'AlterUserTable1736088461999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "fullName" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fullName"`);
    }

}
