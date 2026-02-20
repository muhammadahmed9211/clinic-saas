import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadsCallLogs1721055258827 implements MigrationInterface {
  name = 'LeadsCallLogs1721055258827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "leads_call_log" ("id" int NOT NULL IDENTITY(1,1), "callToUserType" varchar(255) NOT NULL, "callToUserName" varchar(255) NOT NULL, "releatedTo" varchar(255) NOT NULL, "callType" varchar(255) NOT NULL, "outgoingCallStatus" varchar(255) NOT NULL, "callStartDateTime" datetime, "callEndDateTime" datetime, "callDuration" varchar(255), "callOwner" varchar(255) NOT NULL, "subject" varchar(255) NOT NULL, "callAgenda" varchar(255) NOT NULL, "description" varchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_feaa2eb4f6d275c5194f7c1a2dc" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_c2cc5b210fcc2d7ab2ee164a682" DEFAULT getdate(), "deletedAt" datetime2, "callResults" int, "leadId" int, CONSTRAINT "PK_326190a40b4678fa225c38aabd9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads_call_log" ADD CONSTRAINT "FK_2ca3a3081f668ef23014118fd1b" FOREIGN KEY ("callResults") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads_call_log" ADD CONSTRAINT "FK_2a0ccf83c672fc389383c53669b" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads_call_log" DROP CONSTRAINT "FK_2a0ccf83c672fc389383c53669b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads_call_log" DROP CONSTRAINT "FK_2ca3a3081f668ef23014118fd1b"`,
    );
    await queryRunner.query(`DROP TABLE "leads_call_log"`);
  }
}
