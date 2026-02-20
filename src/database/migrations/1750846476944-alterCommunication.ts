import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCommunication1750846476944 implements MigrationInterface {
    name = 'AlterCommunication1750846476944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communication" ADD "email_event_name" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communication" DROP COLUMN "email_event_name"`);
    }

}
