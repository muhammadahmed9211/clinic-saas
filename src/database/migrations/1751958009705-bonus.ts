import { MigrationInterface, QueryRunner } from "typeorm";

export class Bonus1751958009705 implements MigrationInterface {
    name = 'Bonus1751958009705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bonus" ALTER COLUMN "bonusAmount" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bonus_reward" ADD CONSTRAINT "FK_3d837f1271b24c04f579f11f155" FOREIGN KEY ("bonusId") REFERENCES "bonus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bonus" ALTER COLUMN "bonusAmount" int`);
        await queryRunner.query(`ALTER TABLE "bonus_reward" ADD CONSTRAINT "FK_bonus_reward_bonus" FOREIGN KEY ("bonusId") REFERENCES "bonus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
