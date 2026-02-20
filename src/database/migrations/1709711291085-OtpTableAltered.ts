import { MigrationInterface, QueryRunner } from 'typeorm';

export class OtpTableAltered1709711291085 implements MigrationInterface {
  name = 'OtpTableAltered1709711291085';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otp" DROP CONSTRAINT "CHK_4b807945d15af79900afea8df7"`,
    );
    await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "otp" ADD "type" nvarchar(255) CONSTRAINT CHK_6e5d211b507ce4e20fdf4af340_ENUM CHECK(type IN ('refresh','reset_password','verify_email','verify_mobile','verify_transaction')) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "otp" ADD "type" varchar(15)`);
    await queryRunner.query(
      `ALTER TABLE "otp" ADD CONSTRAINT "CHK_4b807945d15af79900afea8df7" CHECK (([type]='verify_mobile' OR [type]='verify_email' OR [type]='reset_password' OR [type]='refresh'))`,
    );
  }
}
