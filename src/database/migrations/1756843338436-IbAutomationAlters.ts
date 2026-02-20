import { MigrationInterface, QueryRunner } from "typeorm";

export class IbAutomationAlters1756843338436 implements MigrationInterface {
    name = 'IbAutomationAlters1756843338436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isIntroducingBroker" bit NOT NULL CONSTRAINT "DF_c570d13dba561b48645d9d9bd76" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user" ADD "commissionProfileId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "accountType" nvarchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_13a972fa5f05c410cd3c5543063" FOREIGN KEY ("commissionProfileId") REFERENCES "ib_commission_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD "isPublic" bit NOT NULL CONSTRAINT "DF_9956f62dad778c35192b7acfc23" DEFAULT 0`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_13a972fa5f05c410cd3c5543063"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_c570d13dba561b48645d9d9bd76"`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" DROP CONSTRAINT "DF_9956f62dad778c35192b7acfc23"`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" DROP COLUMN "isPublic"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isIntroducingBroker"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "commissionProfileId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "accountType"`);
    }

}
