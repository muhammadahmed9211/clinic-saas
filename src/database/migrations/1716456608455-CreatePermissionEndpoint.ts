import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionEndpoint1716456608455
  implements MigrationInterface
{
  name = 'CreatePermissionEndpoint1716456608455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission_endpoint" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "isScreen" bit NOT NULL CONSTRAINT "DF_01dc10913a5b57f44e121811ccd" DEFAULT 0, "method" nvarchar(255), "url" nvarchar(255) NOT NULL, "screen" nvarchar(255), "description" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_08dd1aa2f814f56ab8bde01557a" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_cfda738db115b4e1d4deb75086c" DEFAULT getdate(), CONSTRAINT "PK_b8876c038e4cba0f91cb20955b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission_endpoint_rel" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_d74cc94620b9ccd516211dc1fbd" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_422a8acf9787fff5ab7a6770061" DEFAULT getdate(), "permissionId" int, "permissionEndpointId" int, CONSTRAINT "PK_177712243ff443f4570d2af6918" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_endpoint_rel" ADD CONSTRAINT "FK_0e66971e33a9d27f85dc20e3858" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_endpoint_rel" ADD CONSTRAINT "FK_c90c402622eb3a2775c9ea6b9f9" FOREIGN KEY ("permissionEndpointId") REFERENCES "permission_endpoint"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission_endpoint_rel" DROP CONSTRAINT "FK_c90c402622eb3a2775c9ea6b9f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_endpoint_rel" DROP CONSTRAINT "FK_0e66971e33a9d27f85dc20e3858"`,
    );
    await queryRunner.query(`DROP TABLE "permission_endpoint_rel"`);
    await queryRunner.query(`DROP TABLE "permission_endpoint"`);
  }
}
