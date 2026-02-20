import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserVerification1720007305086 implements MigrationInterface {
  name = 'UpdateUserVerification1720007305086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_verification" DROP CONSTRAINT "CHK_40bb68f7e50567209a49fadad3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification" ADD "deviceId" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification" ADD CONSTRAINT "CHK_d20c9b7900f23c4ece65aa9936" CHECK ("verificationType" IN ('email', 'mobile', 'password', 'affiid', 'email_mobile'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_verification" DROP CONSTRAINT "CHK_d20c9b7900f23c4ece65aa9936"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification" DROP COLUMN "deviceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification" ADD CONSTRAINT "CHK_40bb68f7e50567209a49fadad3" CHECK (([verificationType]='affiid' OR [verificationType]='password' OR [verificationType]='mobile' OR [verificationType]='email'))`,
    );
  }
}
