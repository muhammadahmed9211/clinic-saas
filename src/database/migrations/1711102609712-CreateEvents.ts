import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEvents1711102609712 implements MigrationInterface {
  name = 'CreateEvents1711102609712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event" ("id" int NOT NULL IDENTITY(1,1), "name" varchar(255) NOT NULL, "serviceName" varchar(255) NOT NULL, "dataLoggingService" bit NOT NULL CONSTRAINT "DF_8257662e2f946b809381e79d190" DEFAULT 1, "emailService" bit NOT NULL CONSTRAINT "DF_2e526701a1066da1de2b521cccc" DEFAULT 0, "eventLoggingService" bit NOT NULL CONSTRAINT "DF_867bbabb0cb1edb77a04ef21885" DEFAULT 1, "notification" bit NOT NULL CONSTRAINT "DF_25702d382bca1434ee0f274952a" DEFAULT 0, "task" bit NOT NULL CONSTRAINT "DF_432943496c5ba6144fea065da8b" DEFAULT 0, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_77b45e61f3194ba2be468b07789" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_d88128dae17a09fe1327fe550d3" DEFAULT getdate(), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "event"`);
  }
}
