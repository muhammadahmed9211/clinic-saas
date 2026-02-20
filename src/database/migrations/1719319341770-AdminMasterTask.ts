import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminMasterTask1719319341770 implements MigrationInterface {
  name = 'AdminMasterTask1719319341770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin_master_task" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255), "responsible" nvarchar(255), "isForcedComplete" bit NOT NULL CONSTRAINT "DF_d0f29b33e0c28d440f85c7256ab" DEFAULT 0, "sla" int, "isDeleted" bit NOT NULL CONSTRAINT "DF_8b1c22ec51aa2f23f34190279de" DEFAULT 0, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_647736f4c398b84a8dc03cfe337" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_1b954fc8c6fef0283e92077622e" DEFAULT getdate(), "labelId" int, CONSTRAINT "PK_5714e077005aadce44671ebb1ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_e811e88b6ac7fcc4b62b77f9f1" ON "admin_master_task" ("labelId") WHERE "labelId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_master_task" ADD CONSTRAINT "FK_e811e88b6ac7fcc4b62b77f9f1a" FOREIGN KEY ("labelId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_master_task" DROP CONSTRAINT "FK_e811e88b6ac7fcc4b62b77f9f1a"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_e811e88b6ac7fcc4b62b77f9f1" ON "admin_master_task"`,
    );
    await queryRunner.query(`DROP TABLE "admin_master_task"`);
  }
}
