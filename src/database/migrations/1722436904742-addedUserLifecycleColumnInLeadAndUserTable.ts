import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUserLifecycleColumnInLeadAndUserTable1722436904742
  implements MigrationInterface
{
  name = 'AddedUserLifecycleColumnInLeadAndUserTable1722436904742';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "userLifeCycle" varchar(255) CONSTRAINT "DF_d1bb85ba4ef5b112471f98c9c6f" DEFAULT 'lead'`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "CHK_f68ec59864ee4384f8e309526c" CHECK ("userLifeCycle" IN ('lead', 'registered', 'applicant', 'client'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "CHK_f68ec59864ee4384f8e309526c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "DF_d1bb85ba4ef5b112471f98c9c6f"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "userLifeCycle"`);
  }
}
