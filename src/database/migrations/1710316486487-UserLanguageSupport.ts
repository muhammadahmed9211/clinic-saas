import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserLanguageSupport1710316486487 implements MigrationInterface {
  name = 'UserLanguageSupport1710316486487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_1e7430636fd6ab89be8344dec2" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_49568c2027c8bc1f33f7878e18" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_e2fc40ceffd6019d8ae04d5441" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_2628fc9cb4d227f492d1852396" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_1e7430636fd6ab89be8344dec2" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_e6f683a8699d52dacd64eaf7df" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_cee793b9c40e4e5708485d4001" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_afe5235f2534f0b4db2aada6aa" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_03bb2f4ae327fc5257d9d677b7" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_997a25036ba355bdad2d22cb29" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3122b4b8709577da50e89b6898" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_5cb2b3e0419a73a360d327d497" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_b964abf615cd68203dc3a0880c" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_45fdef50616d8364be025a09b1" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_4b7e7bc96277be1a40adf52ce1" ON "user"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_92a00fa561c16ba10b29aa99be" ON "user"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "languageIso"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "languageIso" nvarchar(255) CONSTRAINT CHK_e518bc9f95f57ccebbf34a7a6d_ENUM CHECK(languageIso IN ('EN','AR')) NOT NULL CONSTRAINT "DF_1e7430636fd6ab89be8344dec27" DEFAULT 'EN'`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD "languageIso" nvarchar(255) CONSTRAINT CHK_d6373444517405007954edf7bf_ENUM CHECK(languageIso IN ('EN','AR')) NOT NULL CONSTRAINT "DF_900dde388d37c9241f037bff229" DEFAULT 'EN'`,
    );
    await queryRunner.query(
      `ALTER TABLE "required_kyc_documents" ADD "languageIso" nvarchar(255) CONSTRAINT CHK_b850a5c64682141f601365ab76_ENUM CHECK(languageIso IN ('EN','AR')) NOT NULL CONSTRAINT "DF_694e42590985653a149af164544" DEFAULT 'EN'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_1e7430636fd6ab89be8344dec27"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "languageIso"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "languageIso" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "DF_900dde388d37c9241f037bff229"`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "languageIso"`);
    await queryRunner.query(
      `ALTER TABLE "required_kyc_documents" DROP CONSTRAINT "DF_694e42590985653a149af164544"`,
    );
    await queryRunner.query(
      `ALTER TABLE "required_kyc_documents" DROP COLUMN "languageIso"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_92a00fa561c16ba10b29aa99be" ON "user" ("partnerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b7e7bc96277be1a40adf52ce1" ON "user" ("nationality") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_45fdef50616d8364be025a09b1" ON "user" ("state") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b964abf615cd68203dc3a0880c" ON "user" ("city") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cb2b3e0419a73a360d327d497" ON "user" ("country") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3122b4b8709577da50e89b6898" ON "user" ("address") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_997a25036ba355bdad2d22cb29" ON "user" ("dob") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_03bb2f4ae327fc5257d9d677b7" ON "user" ("userType") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_afe5235f2534f0b4db2aada6aa" ON "user" ("sc") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cee793b9c40e4e5708485d4001" ON "user" ("affid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6f683a8699d52dacd64eaf7df" ON "user" ("demo") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e7430636fd6ab89be8344dec2" ON "user" ("languageIso") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2628fc9cb4d227f492d1852396" ON "user" ("countryIso") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e2fc40ceffd6019d8ae04d5441" ON "user" ("telephonePrefix") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_49568c2027c8bc1f33f7878e18" ON "user" ("telephone") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
  }
}
