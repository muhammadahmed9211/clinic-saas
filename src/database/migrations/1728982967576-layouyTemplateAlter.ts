import { MigrationInterface, QueryRunner } from "typeorm";

export class LayouyTemplateAlter1728982967576 implements MigrationInterface {
    name = 'LayouyTemplateAlter1728982967576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" ADD "name" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "layout" ADD "user_id" int`);
        await queryRunner.query(`ALTER TABLE "template" ADD "user_id" int`);
        await queryRunner.query(`ALTER TABLE "layout" ADD CONSTRAINT "FK_636f042ca30300d475f759339c6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "FK_8e88152c46dcdac7827f32b9267" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "FK_8e88152c46dcdac7827f32b9267"`);
        await queryRunner.query(`ALTER TABLE "layout" DROP CONSTRAINT "FK_636f042ca30300d475f759339c6"`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "layout" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "layout" DROP COLUMN "name"`);
    }

}
