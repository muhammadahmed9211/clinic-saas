import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskRepeatEntity1729079896929 implements MigrationInterface {
    name = 'TaskRepeatEntity1729079896929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_task" ADD "repeat" varchar(255) CONSTRAINT CHK_0e18843e7a71792757344fef95_ENUM CHECK(repeat IN ('never','daily','weekly','monthly')) NOT NULL CONSTRAINT "DF_dc36786ddd7e13a8ef491d6cad0" DEFAULT 'never'`);
        await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "repeatIntervalType"`);
        await queryRunner.query(`ALTER TABLE "admin_task" ADD "repeatIntervalType" varchar(255) CONSTRAINT CHK_75496b8fabbe1541e51dcef034_ENUM CHECK(repeatIntervalType IN ('never','after','on')) NOT NULL CONSTRAINT "DF_da8d37a7b1d9aad79b8608af93e" DEFAULT 'never'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_task" DROP CONSTRAINT "DF_da8d37a7b1d9aad79b8608af93e"`);
        await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "repeatIntervalType"`);
        await queryRunner.query(`ALTER TABLE "admin_task" ADD "repeatIntervalType" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "admin_task" DROP CONSTRAINT "DF_dc36786ddd7e13a8ef491d6cad0"`);
        await queryRunner.query(`ALTER TABLE "admin_task" DROP COLUMN "repeat"`);
    }

}
