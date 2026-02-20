import { MigrationInterface, QueryRunner } from "typeorm";

export class ZapierWebhookLogs1741164024217 implements MigrationInterface {
    name = 'ZapierWebhookLogs1741164024217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "zapier_webhook_logs" ("id" int NOT NULL IDENTITY(1,1), "payload" nvarchar(max) NOT NULL, "email" nvarchar(255), "createdAt" datetime NOT NULL CONSTRAINT "DF_2e3a29c7ee3570bd91bbba73e68" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_72f3f1c98c39caa07395eea0897" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "zapier_webhook_logs"`);
    }

}
