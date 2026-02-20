import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskReminderEntity1729173184197 implements MigrationInterface {
    name = 'TaskReminderEntity1729173184197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`EXEC sp_rename "admin_task.reminder", "remindBefore"`);
        await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "remindBefore"`);
        await queryRunner.query(`ALTER TABLE "admin_task" ADD "remindBefore" int`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "remindBefore"`);
        await queryRunner.query(`ALTER TABLE "admin_task" ADD "remindBefore" datetime`);
        await queryRunner.query(`EXEC sp_rename "admin_task.remindBefore", "reminder"`);
    }

}
