import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPostalCodeInUser1713265689751 implements MigrationInterface {
  name = 'AddedPostalCodeInUser1713265689751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "postalCode" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "postalCode"`);
  }
}
