import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPSPPriorityTables1754314255124 implements MigrationInterface {
    name = 'AddedPSPPriorityTables1754314255124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "psp_method" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_e82520c31c9f92b5e92464db732" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_8656dfbccd926eef23ff5333510" DEFAULT getdate(), "deletedAt" datetime2, "methodId" int, "pspId" int, CONSTRAINT "PK_5079de4661aa4f159cce4385d55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "countries" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "nameAr" nvarchar(255),"iso" nvarchar(255), "createdAt" datetime NOT NULL CONSTRAINT "DF_ea66249113e97cd29d61cde7277" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_e02f87d45e689f076cb14a6a4c1" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "psp_countries_priority" ("id" int NOT NULL IDENTITY(1,1), "countryId" int NOT NULL, "pspId" int NOT NULL, "priority" int NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_ab9b099f120192bff663d336589" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_7cf48502e214a55e7a96844e139" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_56d536a94f2759927dbd29f667b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "psp_countries" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "iso" nvarchar(255), "createdAt" datetime NOT NULL CONSTRAINT "DF_c4bed76ead0a7a175d5f182dcbe" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_08fc14b5c67a45e36b38f65d3ce" DEFAULT getdate(), "deletedAt" datetime2, "countryId" int, "pspId" int, CONSTRAINT "PK_80b82b778d9344852082b73b43c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_attempts" ("id" int NOT NULL IDENTITY(1,1), "userId" int NOT NULL, "pspId" int NOT NULL, "isError" bit NOT NULL CONSTRAINT "DF_593f6e11d35b74ad9d7b513da58" DEFAULT 0, "requestPayload" nvarchar(MAX), "responsePayload" nvarchar(MAX), "errorMessage" nvarchar(MAX), "createdAt" datetime NOT NULL CONSTRAINT "DF_6914e4272e624e437786ebcdbe2" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_2a633fae853cb20d1c5d951dc06" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_05630f10345ebd11091283becb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "psp" ADD "minDeposit" float NOT NULL CONSTRAINT "DF_7f65425b16b26b494e0ec7dea75" DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "psp" ADD "maxDeposit" float NOT NULL CONSTRAINT "DF_83a46ac9adc2d88883a928dff4b" DEFAULT 1000000`);
        await queryRunner.query(`ALTER TABLE "psp" ADD "isCountryRestricted" bit NOT NULL CONSTRAINT "DF_e6ed604a55b65f7d5b14a298a5a" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "psp" ADD "countryRestrictionType" nvarchar(255) NOT NULL CONSTRAINT "DF_4f6cbc6175baea4f9a6c2477e3e" DEFAULT 'Include'`);
        await queryRunner.query(`ALTER TABLE "psp" ADD "isRegulationRestricted" bit NOT NULL CONSTRAINT "DF_8ab84c569fcf3b72af8349394d9" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "psp" ADD "regulationRestrictionType" nvarchar(255) NOT NULL CONSTRAINT "DF_b786a2068d09f47ae138baa4720" DEFAULT 'Include'`);
        await queryRunner.query(`ALTER TABLE "psp" ADD "isOperational" bit NOT NULL CONSTRAINT "DF_3f9abd33615903f8111e19a7312" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "psp_method" ADD CONSTRAINT "FK_1428d5e6b0339a856906523d879" FOREIGN KEY ("methodId") REFERENCES "transaction_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "psp_method" ADD CONSTRAINT "FK_e0ee355bd543f0eb816676b4efd" FOREIGN KEY ("pspId") REFERENCES "psp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "psp_countries_priority" ADD CONSTRAINT "FK_1c0a5b52cded664a3c960407427" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "psp_countries_priority" ADD CONSTRAINT "FK_200278db3caec4621c5cb713535" FOREIGN KEY ("pspId") REFERENCES "psp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "psp_countries" ADD CONSTRAINT "FK_da20a553372f3c22da8c3bb7da4" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "psp_countries" ADD CONSTRAINT "FK_ed0b911f374a944075e65c85c3f" FOREIGN KEY ("pspId") REFERENCES "psp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_attempts" ADD CONSTRAINT "FK_f583f954c777a5e0d1f9e29440b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_attempts" ADD CONSTRAINT "FK_bd21aac1eb887ae914d48858753" FOREIGN KEY ("pspId") REFERENCES "psp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "aggregator_regulations" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_c8f26c19c67f909b47cbb0251e7" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_141f3027581509a8889d889e225" DEFAULT getdate(), "deletedAt" datetime2, "regulationId" int, "aggregatorId" int, CONSTRAINT "PK_e9e3d3ceb41c9486ea8e533d806" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "aggregator_regulations" ADD CONSTRAINT "FK_49b84637bf0af3a1767d4b88574" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "aggregator_regulations" ADD CONSTRAINT "FK_d34ecbca3978cf303da10aa5264" FOREIGN KEY ("aggregatorId") REFERENCES "aggregator_psp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "aggregator_regulations" ADD "priority" int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_attempts" DROP CONSTRAINT "FK_bd21aac1eb887ae914d48858753"`);
        await queryRunner.query(`ALTER TABLE "transaction_attempts" DROP CONSTRAINT "FK_f583f954c777a5e0d1f9e29440b"`);
        await queryRunner.query(`ALTER TABLE "psp_countries" DROP CONSTRAINT "FK_ed0b911f374a944075e65c85c3f"`);
        await queryRunner.query(`ALTER TABLE "psp_countries" DROP CONSTRAINT "FK_da20a553372f3c22da8c3bb7da4"`);
        await queryRunner.query(`ALTER TABLE "psp_countries_priority" DROP CONSTRAINT "FK_200278db3caec4621c5cb713535"`);
        await queryRunner.query(`ALTER TABLE "psp_countries_priority" DROP CONSTRAINT "FK_1c0a5b52cded664a3c960407427"`);
        await queryRunner.query(`ALTER TABLE "psp_method" DROP CONSTRAINT "FK_e0ee355bd543f0eb816676b4efd"`);
        await queryRunner.query(`ALTER TABLE "psp_method" DROP CONSTRAINT "FK_1428d5e6b0339a856906523d879"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "DF_b786a2068d09f47ae138baa4720"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "regulationRestrictionType"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "DF_8ab84c569fcf3b72af8349394d9"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "isRegulationRestricted"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "DF_4f6cbc6175baea4f9a6c2477e3e"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "countryRestrictionType"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "DF_e6ed604a55b65f7d5b14a298a5a"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "isCountryRestricted"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "DF_83a46ac9adc2d88883a928dff4b"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "maxDeposit"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "DF_7f65425b16b26b494e0ec7dea75"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "minDeposit"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "DF_3f9abd33615903f8111e19a7312"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "isOperational"`);
        await queryRunner.query(`ALTER TABLE "aggregator_regulations" DROP CONSTRAINT "FK_d34ecbca3978cf303da10aa5264"`);
        await queryRunner.query(`ALTER TABLE "aggregator_regulations" DROP CONSTRAINT "FK_49b84637bf0af3a1767d4b88574"`);
        await queryRunner.query(`DROP TABLE "transaction_attempts"`);
        await queryRunner.query(`DROP TABLE "psp_countries"`);
        await queryRunner.query(`DROP TABLE "psp_countries_priority"`);
        await queryRunner.query(`DROP TABLE "countries"`);
        await queryRunner.query(`DROP TABLE "psp_method"`);
        await queryRunner.query(`DROP TABLE "aggregator_regulations"`);
        await queryRunner.query(`ALTER TABLE "aggregator_regulations" DROP COLUMN "priority"`);
        }

}
