import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedBonusColumnTransaction1751034313681 implements MigrationInterface {
    name = 'AddedBonusColumnTransaction1751034313681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bonus_reward" ADD CONSTRAINT "FK_1bb4e28532d16f842053e540338" FOREIGN KEY ("mt5AccountId") REFERENCES "mt5_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bonus_reward" ADD CONSTRAINT "FK_170ca6fc0935c16adcab91cae2f" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bonus_reward" ADD CONSTRAINT "FK_e3f22c28e6451d485abadd42cc0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "isTradingAccountAutoDeposit" bit NOT NULL CONSTRAINT "DF_188236e64b3ecd1aa012bd06542" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "isBonusApplicable" bit NOT NULL CONSTRAINT "DF_352eaae641520a68885abf00006" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "bonusCode" varchar(255)`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "tradingAccountRef" varchar(255)`);
        await queryRunner.query(`CREATE TABLE "bonus_reward" ("id" int NOT NULL IDENTITY(1,1), "code" nvarchar(255) NOT NULL, "amount" int NOT NULL, "tradingPlatformRef" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_7f9dfc7617c6aaab1f222920a0f" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_c9377ad05c5f49d11dd6d769d96" DEFAULT getdate(), "deletedAt" datetime2, "mt5AccountId" int NOT NULL, "transactionId" uniqueidentifier NOT NULL, "userId" int, CONSTRAINT "UQ_6a1c7712dfee183501796791401" UNIQUE ("userId", "code"), CONSTRAINT "PK_185785c860f4d08afc15120876f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bonus_reward" DROP CONSTRAINT "FK_e3f22c28e6451d485abadd42cc0"`);
        await queryRunner.query(`ALTER TABLE "bonus_reward" DROP CONSTRAINT "FK_170ca6fc0935c16adcab91cae2f"`);
        await queryRunner.query(`ALTER TABLE "bonus_reward" DROP CONSTRAINT "FK_1bb4e28532d16f842053e540338"`);
        await queryRunner.query(`DROP TABLE "bonus_reward"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "tradingAccountRef"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "bonusCode"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "DF_352eaae641520a68885abf00006"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isBonusApplicable"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "DF_188236e64b3ecd1aa012bd06542"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isTradingAccountAutoDeposit"`);
    }

}
