import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerList1708329384891 implements MigrationInterface {
  name = 'PartnerList1708329384891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partner_list" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "key" int NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_af9612a790e887ce5accde5ce2d" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_9f4dd6f82ad8fd1da7b8a12a056" DEFAULT getdate(), CONSTRAINT "PK_fe2ba02741a8eaee15adf0d1fef" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "partner_list"`);
  }
}
