import { MigrationInterface, QueryRunner } from 'typeorm';

export class Otp1706705716587 implements MigrationInterface {
  name = 'Otp1706705716587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "otp" ("id" int NOT NULL IDENTITY(1,1), "otp" varchar(6), "email" varchar(100), "mobile" varchar(15), "type" varchar(15), "expires" datetime, "blacklisted" bit NOT NULL CONSTRAINT "DF_002c457b9eeb92549484337dbb2" DEFAULT 0, "createdAt" datetime NOT NULL CONSTRAINT "DF_65f34c2bcc41868b354be592b87" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_fcda1d3c5c2dd8aa566016d4a79" DEFAULT getdate(), CONSTRAINT "CHK_4b807945d15af79900afea8df7" CHECK (type IN ('refresh', 'reset_password', 'verify_email', 'verify_mobile')), CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "otp"`);
  }
}
