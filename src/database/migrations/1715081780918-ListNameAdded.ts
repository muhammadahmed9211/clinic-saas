import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListNameAdded1715081780918 implements MigrationInterface {
  name = 'ListNameAdded1715081780918';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "list_name" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "appName" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_1c3af1db4c3adefcd524477bca0" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_5704122d7b712dab68392b4e23b" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_856dd55af91726c4fc08cddfd2b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "list_name"`);
  }
}
