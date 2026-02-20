import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadsUpdated1720782143202 implements MigrationInterface {
  name = 'LeadsUpdated1720782143202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" ADD "clientID" varchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "leadGrading" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "designation" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "expectedinvestment" varchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "country" varchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "language" varchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesRep" varchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "referral" varchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "localTime" datetime`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "preferredTime" datetime`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "salesManager" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "salesPartner" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "salesOffice" varchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "DOB" datetime`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "DOB"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesOffice"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesPartner"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesManager"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "preferredTime"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "localTime"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "referral"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesRep"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "language"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "country"`);
    await queryRunner.query(
      `ALTER TABLE "lead" DROP COLUMN "expectedinvestment"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "designation"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "leadGrading"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "clientID"`);
  }
}
