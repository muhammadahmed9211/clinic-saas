import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIbConfiguration1745390700436 implements MigrationInterface {
    name = 'CreateIbConfiguration1745390700436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ib_commission_profile" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "level" int NOT NULL, "server" nvarchar(255), "isActive" bit NOT NULL CONSTRAINT "DF_96ceab883091296fe7f72681b25" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_046589c3003f01afe683fdc7518" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_417105dd652bf043aa26977421a" DEFAULT getdate(), "deletedAt" datetime2, "createdById" int, CONSTRAINT "UQ_1a62e5bef82f79bac0e54086ec8" UNIQUE ("name"), CONSTRAINT "PK_3f0ffdbb726d7e98659b9ab1e7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD CONSTRAINT "FK_78a54e0fdb7e634331dc83327d9" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`CREATE TABLE "ib_commission_profile_type" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_02691ddbf743f30548cc818d700" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_d6aae394c449553782d50e14b30" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "UQ_9ed78af367bfaec1b687ab8e333" UNIQUE ("name"), CONSTRAINT "PK_b83a3772688488e5760d9155044" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE "ib_profile_distribution" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_95dd5d54f6668b41bafe4613e3c" DEFAULT GETDATE(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_7c218b200e0e426be7684046c43" DEFAULT GETDATE(), "deletedAt" datetime2, "profileTypeId" int, CONSTRAINT "PK_2368fc43400e18ebf0ab4697fea" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE "ib_commission_profile_config" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "priority" int NOT NULL, "setCashback" bit, "isDeductFromIb" bit, "cashbackAmountType" nvarchar(255), "cashbackAmount" nvarchar(255), "symbols" nvarchar(255), "entry" nvarchar(255), "scalpingTrades" nvarchar(255), "isActive" bit NOT NULL CONSTRAINT "DF_b8d5902755d9f002fa610b722cd" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_39ce19e292a2f284fe2d8f25351" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_908158f473effd9890c1deaf7d5" DEFAULT getdate(), "deletedAt" datetime2, "commissionProfileId" int, "profileTypeId" int, "createdById" int, CONSTRAINT "UQ_62d98bbe245c3398ec65e7709e7" UNIQUE ("priority"), CONSTRAINT "PK_a8f4af4b9530d9a93bba6ced3a5" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE "ib_distribution" ("id" int NOT NULL IDENTITY(1,1), "key" nvarchar(255) NOT NULL, "value" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_8470842cb915de8cd940b1b4244" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_5dc4af74195ed9544c55087828e" DEFAULT getdate(), "deletedAt" datetime2, "distributionId" int, CONSTRAINT "PK_dbee139c632e76e900a043a7a47" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE "ib_distribution_value" ("id" int NOT NULL IDENTITY(1,1), "distributionLevel" int NOT NULL, "distributionAmount" nvarchar(255) NOT NULL, "level" nvarchar(255), "fromAmount" nvarchar(255), "toAmount" nvarchar(255), "amount" nvarchar(255), "distributionContext" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_cc34f37f7f405d00fd6d887814e" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_5475cd94ee4c8d1ab892675b1ab" DEFAULT getdate(), "deletedAt" datetime2, "distributionId" int, CONSTRAINT "PK_de52875b24794104792169e1536" PRIMARY KEY ("id"))`);

        await queryRunner.query(`ALTER TABLE "ib_profile_distribution" ADD CONSTRAINT "FK_b2b815c25a745e2d6942fce756f" FOREIGN KEY ("profileTypeId") REFERENCES "ib_commission_profile_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "ib_commission_profile_config" ADD CONSTRAINT "FK_898f32664596bdf03323d9e5fd3" FOREIGN KEY ("commissionProfileId") REFERENCES "ib_commission_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile_config" ADD CONSTRAINT "FK_cbc6d4833167a52c6dda6458729" FOREIGN KEY ("profileTypeId") REFERENCES "ib_commission_profile_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile_config" ADD CONSTRAINT "FK_ffe363de05e46e0d1b072ae7904" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "ib_distribution" ADD CONSTRAINT "FK_4e6d9119824af23ad9cf76b1434" FOREIGN KEY ("distributionId") REFERENCES "ib_commission_profile_config"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "ib_distribution_value" ADD CONSTRAINT "FK_c1dcf407301fa4e4e2f08c64268" FOREIGN KEY ("distributionId") REFERENCES "ib_distribution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ib_distribution_value" DROP CONSTRAINT "FK_c1dcf407301fa4e4e2f08c64268"`);

        await queryRunner.query(`ALTER TABLE "ib_distribution" DROP CONSTRAINT "FK_4e6d9119824af23ad9cf76b1434"`);

        await queryRunner.query(`ALTER TABLE "ib_commission_profile_config" DROP CONSTRAINT "FK_ffe363de05e46e0d1b072ae7904"`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile_config" DROP CONSTRAINT "FK_cbc6d4833167a52c6dda6458729"`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile_config" DROP CONSTRAINT "FK_898f32664596bdf03323d9e5fd3"`);

        await queryRunner.query(`ALTER TABLE "ib_profile_distribution" DROP CONSTRAINT "FK_b2b815c25a745e2d6942fce756f"`);

        await queryRunner.query(`DROP TABLE "ib_distribution_value"`);
        await queryRunner.query(`DROP TABLE "ib_distribution"`);
        await queryRunner.query(`DROP TABLE "ib_commission_profile_config"`);
        await queryRunner.query(`DROP TABLE "ib_profile_distribution"`);
        await queryRunner.query(`DROP TABLE "ib_commission_profile_type"`);

        await queryRunner.query(`ALTER TABLE "ib_commission_profile" DROP CONSTRAINT "FK_78a54e0fdb7e634331dc83327d9"`);
        await queryRunner.query(`DROP TABLE "ib_commission_profile"`);
    }
}
