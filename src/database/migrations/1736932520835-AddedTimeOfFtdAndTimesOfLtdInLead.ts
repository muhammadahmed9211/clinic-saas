import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTimeOfFtdAndTimesOfLtdInLead1736932520835
  implements MigrationInterface
{
  name = 'AddedTimeOfFtdAndTimesOfLtdInLead1736932520835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" ADD "timesOfFTD" datetime`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "timesOfLTD" datetime`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "timesOfLTD"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "timesOfFTD"`);
  }
}
