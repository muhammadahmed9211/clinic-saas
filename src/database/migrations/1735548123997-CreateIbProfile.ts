import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIbProfile1735548123997 implements MigrationInterface {
  name = 'CreateIbProfile1735548123997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ib_profile" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "level" int NOT NULL, "server" nvarchar(255), "isActive" bit NOT NULL CONSTRAINT "DF_1ac247e71c4b8040976d33d798b" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_0ffda9d31808a3a6ea8331abef5" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_f29684dd0e622a08325ceacb1c4" DEFAULT getdate(), "createdById" int, CONSTRAINT "UQ_ea0b90939ff9ec821542e1726ed" UNIQUE ("name"), CONSTRAINT "PK_2f6e054869ccaa3fb223b1b0e54" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ib_profile" ADD CONSTRAINT "FK_4daefdb153e17e76e73ed107b6a" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ib_profile" DROP CONSTRAINT "FK_4daefdb153e17e76e73ed107b6a"`,
    );
    await queryRunner.query(`DROP TABLE "ib_profile"`);
  }
}
