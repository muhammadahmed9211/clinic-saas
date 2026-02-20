import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCallLog1717594591046 implements MigrationInterface {
  name = 'UpdateCallLog1717594591046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD "callToUserType" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD "callToUserName" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD "releatedTo" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD "callType" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD "outgoingCallStatus" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD "callStartDateTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD "callOwner" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD "subject" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD "callAgenda" varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "call_log" ADD "callResults" int`);
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD CONSTRAINT "FK_6f05f1aa4d5b9fa51880c446a0d" FOREIGN KEY ("callResults") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "call_log" DROP CONSTRAINT "FK_6f05f1aa4d5b9fa51880c446a0d"`,
    );
    await queryRunner.query(`ALTER TABLE "call_log" DROP COLUMN "callResults"`);
    await queryRunner.query(`ALTER TABLE "call_log" DROP COLUMN "callAgenda"`);
    await queryRunner.query(`ALTER TABLE "call_log" DROP COLUMN "subject"`);
    await queryRunner.query(`ALTER TABLE "call_log" DROP COLUMN "callOwner"`);
    await queryRunner.query(
      `ALTER TABLE "call_log" DROP COLUMN "callStartDateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" DROP COLUMN "outgoingCallStatus"`,
    );
    await queryRunner.query(`ALTER TABLE "call_log" DROP COLUMN "callType"`);
    await queryRunner.query(`ALTER TABLE "call_log" DROP COLUMN "releatedTo"`);
    await queryRunner.query(
      `ALTER TABLE "call_log" DROP COLUMN "callToUserName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" DROP COLUMN "callToUserType"`,
    );
  }
}
