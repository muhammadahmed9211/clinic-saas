import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOpportunityDealOwner1722244934346
  implements MigrationInterface
{
  name = 'UpdateOpportunityDealOwner1722244934346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opportunity" DROP CONSTRAINT "FK_cdc7717fe06ec3e4800fd53ec86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" DROP COLUMN "dealOwnerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD "dealOwnerId" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD CONSTRAINT "FK_cdc7717fe06ec3e4800fd53ec86" FOREIGN KEY ("dealOwnerId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opportunity" DROP CONSTRAINT "FK_cdc7717fe06ec3e4800fd53ec86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" DROP COLUMN "dealOwnerId"`,
    );
    await queryRunner.query(`ALTER TABLE "opportunity" ADD "dealOwnerId" int`);
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD CONSTRAINT "FK_cdc7717fe06ec3e4800fd53ec86" FOREIGN KEY ("dealOwnerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
