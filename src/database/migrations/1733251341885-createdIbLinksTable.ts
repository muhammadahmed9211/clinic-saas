import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedIbLinksTable1733251341885 implements MigrationInterface {
  name = 'CreatedIbLinksTable1733251341885';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ib_links" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "p1" nvarchar(255) NOT NULL, "p2" nvarchar(255) NOT NULL, "p3" nvarchar(255) NOT NULL, "url" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_6c72fc9d20338d4b62cb6031444" DEFAULT getdate(), "deletedAt" datetime2, "updatedAt" datetime NOT NULL CONSTRAINT "DF_9f09f5692f7a86901a9ccab7659" DEFAULT getdate(), "ibId" int, CONSTRAINT "PK_8389f4539c7344a7d1c60452fb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ib_links" ADD CONSTRAINT "FK_f0898a65bae5e48c8d28c13e1fb" FOREIGN KEY ("ibId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ib_links" DROP CONSTRAINT "FK_f0898a65bae5e48c8d28c13e1fb"`,
    );
    await queryRunner.query(`DROP TABLE "ib_links"`);
  }
}
