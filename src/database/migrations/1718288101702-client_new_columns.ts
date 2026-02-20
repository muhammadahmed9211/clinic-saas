import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientNewColumns1718288101702 implements MigrationInterface {
  name = 'ClientNewColumns1718288101702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "passwordExpiryDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "passwordExpiryDate" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "telephoneConfirmationTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "telephoneConfirmationTime" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "telephoneConfirmationTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "telephoneConfirmationTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "passwordExpiryDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "passwordExpiryDate" datetime`,
    );
  }
}
