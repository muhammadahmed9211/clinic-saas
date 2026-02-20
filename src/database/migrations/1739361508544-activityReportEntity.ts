import { MigrationInterface, QueryRunner } from "typeorm";

export class ActivityReportEntity1739361508544 implements MigrationInterface {
    name = 'ActivityReportEntity1739361508544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activity_reports" ("id" int NOT NULL IDENTITY(1,1), "statusId" int NOT NULL, "weightage" float NOT NULL CONSTRAINT "DF_951480b2033e9838b2ca4c4e692" DEFAULT 0, "createdAt" datetime NOT NULL CONSTRAINT "DF_87e704b8acdf9627b7427b673c0" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_c2a38e7089f1583c7726e45c653" DEFAULT getdate(), "deleted_at" datetime2, CONSTRAINT "PK_be1fa0ad267e5f3633e5d6e7636" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activity_reports" ADD CONSTRAINT "FK_9648c9beeac8344d66c4a6a3b01" FOREIGN KEY ("statusId") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity_reports" DROP CONSTRAINT "FK_9648c9beeac8344d66c4a6a3b01"`);
        await queryRunner.query(`DROP TABLE "activity_reports"`);
    }

}
