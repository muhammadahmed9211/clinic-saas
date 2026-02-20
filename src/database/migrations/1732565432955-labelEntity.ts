import { MigrationInterface, QueryRunner } from "typeorm";

export class LabelEntity1732565432955 implements MigrationInterface {
    name = 'LabelEntity1732565432955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "label_translation" ADD "deletedAt" datetime2`);
        await queryRunner.query(`ALTER TABLE "label" ADD "deletedAt" datetime2`);
        await queryRunner.query(`ALTER TABLE "label" ADD "userId" int`);
        await queryRunner.query(`ALTER TABLE "label" ADD CONSTRAINT "FK_e5d0325ea0283e5f316dee36a08" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "label_translation" ADD CONSTRAINT "UQ_51154f54eee95db38c99d168564" UNIQUE ("langCode", "regulationId", "labelId", "deletedAt")`);
        await queryRunner.query(`ALTER TABLE "label" ADD CONSTRAINT "UQ_fe39b4d76ec70250921fba835e3" UNIQUE ("key", "deletedAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "label" DROP CONSTRAINT "UQ_fe39b4d76ec70250921fba835e3"`);
        await queryRunner.query(`ALTER TABLE "label" DROP CONSTRAINT "FK_e5d0325ea0283e5f316dee36a08"`);
        await queryRunner.query(`ALTER TABLE "label_translation" DROP CONSTRAINT "UQ_51154f54eee95db38c99d168564"`);
        await queryRunner.query(`ALTER TABLE "label" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "label" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "label_translation" DROP COLUMN "deletedAt"`);
    }

}
