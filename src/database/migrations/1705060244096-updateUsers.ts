import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsers1705060244096 implements MigrationInterface {
  name = 'UpdateUsers1705060244096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_verification" ("id" int NOT NULL IDENTITY(1,1), "email" varchar(255) NOT NULL, "mobile" varchar(255), "sid" varchar(255) NOT NULL, "verificationType" varchar(255) NOT NULL, "isMobileVerified" bit NOT NULL CONSTRAINT "DF_4dbe00046459596a5c37a9f7d39" DEFAULT 0, "isEmailVerified" bit NOT NULL CONSTRAINT "DF_71d32417c0152044aeaef99b390" DEFAULT 0, "isAffiIDVerified" bit NOT NULL CONSTRAINT "DF_cbdc45479e6ab34fae9bb6e6a55" DEFAULT 0, "isActive" bit NOT NULL CONSTRAINT "DF_3c7e96bc032fdc2adc4b4590102" DEFAULT 1, "createdAt" int NOT NULL, "updatedAt" int, CONSTRAINT "CHK_40bb68f7e50567209a49fadad3" CHECK ("verificationType" IN ('email', 'mobile', 'password', 'affiid')), CONSTRAINT "PK_679edeb6fcfcbc4c094573e27e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "telephone" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "telephonePrefix" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "countryIso" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "languageIso" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "demo" bit`);
    await queryRunner.query(`ALTER TABLE "user" ADD "affid" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "user" ADD "p1" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "user" ADD "sc" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "user" ADD "userType" int`);
    await queryRunner.query(
      `CREATE INDEX "IDX_49568c2027c8bc1f33f7878e18" ON "user" ("telephone") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e2fc40ceffd6019d8ae04d5441" ON "user" ("telephonePrefix") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2628fc9cb4d227f492d1852396" ON "user" ("countryIso") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e7430636fd6ab89be8344dec2" ON "user" ("languageIso") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6f683a8699d52dacd64eaf7df" ON "user" ("demo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cee793b9c40e4e5708485d4001" ON "user" ("affid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5eb4669aabe6a242d6b3f6a960" ON "user" ("p1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_afe5235f2534f0b4db2aada6aa" ON "user" ("sc") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_03bb2f4ae327fc5257d9d677b7" ON "user" ("userType") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_03bb2f4ae327fc5257d9d677b7" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_afe5235f2534f0b4db2aada6aa" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_5eb4669aabe6a242d6b3f6a960" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_cee793b9c40e4e5708485d4001" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_e6f683a8699d52dacd64eaf7df" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_1e7430636fd6ab89be8344dec2" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_2628fc9cb4d227f492d1852396" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_e2fc40ceffd6019d8ae04d5441" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_49568c2027c8bc1f33f7878e18" ON "user"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userType"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sc"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "p1"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "affid"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "demo"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "languageIso"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "countryIso"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telephonePrefix"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telephone"`);
    await queryRunner.query(`DROP TABLE "user_verification"`);
  }
}
