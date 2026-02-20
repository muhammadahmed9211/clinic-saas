import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolePermission1715683856442 implements MigrationInterface {
  name = 'CreateRolePermission1715683856442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" int NOT NULL IDENTITY(1,1), "key" nvarchar(255) NOT NULL, "category" nvarchar(255) NOT NULL, "subCategory" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "description" nvarchar(255), "readOnly" bit NOT NULL CONSTRAINT "DF_914e829bbf7e8dbd9890152c008" DEFAULT 0, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_142268069f3d66724609cf04596" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_78810226b7f48de83503a03375a" DEFAULT getdate(), CONSTRAINT "UQ_20ff45fefbd3a7c04d2572c3bbd" UNIQUE ("key"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission_category" ("id" int NOT NULL IDENTITY(1,1), "namne" nvarchar(255) NOT NULL, "parentCategoryId" int, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_57075b15d5e7c3ac85946700e22" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_ba032613a8980671bb1ef3ca66c" DEFAULT getdate(), CONSTRAINT "PK_cc1eb9ddcf492149808ee04f3b5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1715683861156 FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1715683862793 FOR "dateTime"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1715351575793. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1715351574321. FOR "dateTime"`,
    );
    await queryRunner.query(`DROP TABLE "permission_category"`);
    await queryRunner.query(`DROP TABLE "permission"`);
  }
}
