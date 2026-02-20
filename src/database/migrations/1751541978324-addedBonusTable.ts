import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedBonusTable1751541978324 implements MigrationInterface {
  name = 'AddedBonusTable1751541978324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bonus" ("id" int NOT NULL IDENTITY(1,1), "bonusCode" nvarchar(255) NOT NULL, "minimumAmount" int NOT NULL, "isActive" bit NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_ae163505161f2d1021f0ca649b5" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_3b7991294cb2d250873f286a85f" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_885c9ca672f42874b1a5cb4d9e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "bonus_reward" ADD "bonusId" int`);
    await queryRunner.query(
      `ALTER TABLE "bonus_reward" ADD CONSTRAINT "FK_3d837f1271b24c04f579f11f155" FOREIGN KEY ("bonusId") REFERENCES "bonus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bonus_reward" DROP CONSTRAINT "FK_3d837f1271b24c04f579f11f155"`,
    );
    await queryRunner.query(`ALTER TABLE "bonus_reward" DROP COLUMN "bonusId"`);
    await queryRunner.query(`DROP TABLE "bonus"`);
  }
}
