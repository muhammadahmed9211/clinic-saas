import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyClientTable1765185497930 implements MigrationInterface {
  name = 'ModifyClientTable1765185497930';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isPhoneCountryChanged" bit NOT NULL CONSTRAINT "DF_47788898603775c185128d0c8f6" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_47788898603775c185128d0c8f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isPhoneCountryChanged"`,
    );
  }
}
