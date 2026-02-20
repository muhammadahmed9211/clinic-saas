import { MigrationInterface, QueryRunner } from "typeorm";

export class FreshDeskTable1731594235334 implements MigrationInterface {
    name = 'FreshDeskTable1731594235334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fresh_desk_logs" ("id" int NOT NULL IDENTITY(1,1), "userId" bigint, "user_email" nvarchar(255), "actions" nvarchar(255), "payload_res" text, CONSTRAINT "PK_c4ce32313a20173a49b9424b6fa" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "fresh_desk_logs"`);
    }

}
