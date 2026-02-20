import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIntervalTypeAndValueInReferralProgram1758800263551 implements MigrationInterface {
    name = 'AddedIntervalTypeAndValueInReferralProgram1758800263551'

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "referral_program" ADD "intervalValue" int NOT NULL CONSTRAINT "DF_24cb73a0a798416bf5705c8035f" DEFAULT 1`);
         await queryRunner.query(`ALTER TABLE "referral_program" ADD "intervalType" nvarchar(255) NOT NULL CONSTRAINT "DF_eb4198931e8cf327c30a183de7f" DEFAULT 'MONTH'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral_program" DROP CONSTRAINT "DF_eb4198931e8cf327c30a183de7f"`);
        await queryRunner.query(`ALTER TABLE "referral_program" DROP COLUMN "intervalType"`);
        await queryRunner.query(`ALTER TABLE "referral_program" DROP CONSTRAINT "DF_24cb73a0a798416bf5705c8035f"`);
        await queryRunner.query(`ALTER TABLE "referral_program" DROP COLUMN "intervalValue"`);
    }

}
