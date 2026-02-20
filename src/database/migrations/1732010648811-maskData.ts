import { MigrationInterface, QueryRunner } from 'typeorm';

export class MaskData1732010648811 implements MigrationInterface {
  name = 'MaskData1732010648811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mask_data" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "key" nvarchar(255) NOT NULL, "maskPattern" nvarchar(255) NOT NULL, "description" nvarchar(255), "createdAt" datetime NOT NULL CONSTRAINT "DF_d7ca2846c4568dc6fbcf54c4558" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_1049852df29da40abac1758f366" DEFAULT getdate(), "roleId" int, CONSTRAINT "UQ_ba4092244b1e61cd519e54ff3a3" UNIQUE ("key"), CONSTRAINT "PK_ead2b4f0b4a6d45e6e451454d97" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "mask_data" ADD CONSTRAINT "FK_05ef081bbb4153d83f3e7d02449" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mask_data" DROP CONSTRAINT "FK_05ef081bbb4153d83f3e7d02449"`,
    );
    await queryRunner.query(`DROP TABLE "mask_data"`);
  }
}
