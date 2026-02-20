import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskReminderEntity1729174064130 implements MigrationInterface {
    name = 'TaskReminderEntity1729174064130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_task" ADD "reminder" datetime`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "reminder"`);
    }

}
