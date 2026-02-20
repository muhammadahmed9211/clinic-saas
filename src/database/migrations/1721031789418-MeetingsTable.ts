import { MigrationInterface, QueryRunner } from 'typeorm';

export class MeetingsTable1721031789418 implements MigrationInterface {
  name = 'MeetingsTable1721031789418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "meeting_participants" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_1e42d0feca9c27f9caaa2a35d87" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_a3e58bd5a509e34cb3415a026c4" DEFAULT getdate(), "deletedAt" datetime2, "participantId" int, "meetingId" int, CONSTRAINT "PK_994ee66a92de655fb478c038980" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "meetings" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255), "location" nvarchar(255), "allDay" bit, "from" datetime, "to" datetime, "host" nvarchar(255), "description" nvarchar(255), "status" nvarchar(255), "isDeleted" bit, "createdAt" datetime NOT NULL CONSTRAINT "DF_e4276654866816c2820b0206e55" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_be2ade154a1db1a7d04972dbf22" DEFAULT getdate(), "deletedAt" datetime2, "relatedToId" bigint, CONSTRAINT "PK_aa73be861afa77eb4ed31f3ed57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "meeting_participants" ADD CONSTRAINT "FK_ea3b5f27605d381fcc33db9e690" FOREIGN KEY ("participantId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "meeting_participants" ADD CONSTRAINT "FK_73193d0c84f0a62e423fc513027" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD CONSTRAINT "FK_9733fa31d47dbc274c2cf93b8d2" FOREIGN KEY ("relatedToId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP CONSTRAINT "FK_9733fa31d47dbc274c2cf93b8d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meeting_participants" DROP CONSTRAINT "FK_73193d0c84f0a62e423fc513027"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meeting_participants" DROP CONSTRAINT "FK_ea3b5f27605d381fcc33db9e690"`,
    );
    await queryRunner.query(`DROP TABLE "meetings"`);
    await queryRunner.query(`DROP TABLE "meeting_participants"`);
  }
}
