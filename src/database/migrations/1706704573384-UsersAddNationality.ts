import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersAddNationality1706704573384 implements MigrationInterface {
  name = 'UsersAddNationality1706704573384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "nationality" nvarchar(255)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b7e7bc96277be1a40adf52ce1" ON "user" ("nationality") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_4b7e7bc96277be1a40adf52ce1" ON "user"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nationality"`);
  }
}
