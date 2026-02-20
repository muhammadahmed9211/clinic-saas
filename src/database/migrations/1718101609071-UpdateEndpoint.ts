import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEndpoint1718101609071 implements MigrationInterface {
  name = 'UpdateEndpoint1718101609071';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission_endpoint" ADD "type" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission_endpoint" DROP COLUMN "type"`,
    );
  }
}
