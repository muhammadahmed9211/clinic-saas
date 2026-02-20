import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUserLifecycleColumnInClientTable1722441577157
  implements MigrationInterface
{
  name = 'AddedUserLifecycleColumnInClientTable1722441577157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "userLifeCycle" nvarchar(255) CONSTRAINT "DF_c066eaea27cd670e741d6b8108d" DEFAULT 'lead'`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "CHK_784b14dd7a498de07bdcc26bcc" CHECK ("userLifeCycle" IN ('lead', 'registered', 'applicant', 'client'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "CHK_784b14dd7a498de07bdcc26bcc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_c066eaea27cd670e741d6b8108d"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "userLifeCycle"`);
  }
}
