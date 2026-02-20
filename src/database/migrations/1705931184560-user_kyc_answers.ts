import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserKycAnswers1705931184560 implements MigrationInterface {
  name = 'UserKycAnswers1705931184560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_answer" ("id" int NOT NULL IDENTITY(1,1), "userId" int NOT NULL, "questionId" int NOT NULL, "answerId" int NOT NULL, "answerText" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_e52bed5d3882732120ab66e59c4" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_9162a1719cbe9767fb5514dc14e" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_37b32f666e59572775b1b020fb5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "dob" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "user" ADD "address" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "user" ADD "country" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "user" ADD "city" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "user" ADD "state" nvarchar(255)`);
    await queryRunner.query(
      `CREATE INDEX "IDX_997a25036ba355bdad2d22cb29" ON "user" ("dob") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3122b4b8709577da50e89b6898" ON "user" ("address") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cb2b3e0419a73a360d327d497" ON "user" ("country") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b964abf615cd68203dc3a0880c" ON "user" ("city") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_45fdef50616d8364be025a09b1" ON "user" ("state") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_45fdef50616d8364be025a09b1" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_b964abf615cd68203dc3a0880c" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_5cb2b3e0419a73a360d327d497" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3122b4b8709577da50e89b6898" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_997a25036ba355bdad2d22cb29" ON "user"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "country"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dob"`);
    await queryRunner.query(`DROP TABLE "user_answer"`);
  }
}
