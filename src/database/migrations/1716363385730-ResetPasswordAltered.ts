import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResetPasswordAltered1716363385730 implements MigrationInterface {
  name = 'ResetPasswordAltered1716363385730';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reset_password" DROP CONSTRAINT "DF_5527e40e455ce426defaa89e8a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reset_password" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reset_password" ADD "status" nvarchar(255) CONSTRAINT CHK_2e08ddee2b2f88e887387f75c8_ENUM CHECK(status IN ('ACTIVE','INACTIVE')) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reset_password" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reset_password" ADD "status" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reset_password" ADD CONSTRAINT "DF_5527e40e455ce426defaa89e8a5" DEFAULT 1 FOR "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reset_password" ADD CONSTRAINT "FK_20b304cde809f95a03deb52a895" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
