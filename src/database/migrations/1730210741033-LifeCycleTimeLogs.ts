import { MigrationInterface, QueryRunner } from "typeorm";

export class LifeCycleTimeLogs1730210741033 implements MigrationInterface {
    name = 'LifeCycleTimeLogs1730210741033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`applicantCreatedTime`);
        await queryRunner.query(`registeredCreatedTime`);
        await queryRunner.query(`ALTER TABLE "lead" ADD "clientCreatedTime" datetime2 NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "clientCreatedTime"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "registeredCreatedTime"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "applicantCreatedTime"`);      
    }

}
