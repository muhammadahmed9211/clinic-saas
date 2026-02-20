import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedFirstAndLastNameInPartner1729758971912
  implements MigrationInterface
{
  name = 'AddedFirstAndLastNameInPartner1729758971912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "firstName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "lastName" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "firstName"`);
  }
}
