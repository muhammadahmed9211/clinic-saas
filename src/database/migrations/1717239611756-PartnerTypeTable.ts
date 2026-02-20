import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerTypeTable1717239611756 implements MigrationInterface {
  name = 'PartnerTypeTable1717239611756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partner_type" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_0db490822322266c1b43bdfbd34" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_1bcbfd70cf382bbfbe2fe6c25d8" DEFAULT getdate(), CONSTRAINT "PK_113ea8f499b431942768929a231" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "partner_type"`);
  }
}
