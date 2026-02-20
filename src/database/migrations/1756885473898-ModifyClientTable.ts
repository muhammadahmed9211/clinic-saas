import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyClientTable1756885473898 implements MigrationInterface {
  name = 'ModifyClientTable1756885473898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "commissionProfileId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "commissionProfileId" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_b628ab1d47b4cbe54692e9ed550" FOREIGN KEY ("commissionProfileId") REFERENCES "ib_commission_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "commissionProfileId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "commissionProfileId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_13a972fa5f05c410cd3c5543063" FOREIGN KEY ("commissionProfileId") REFERENCES "ib_commission_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
