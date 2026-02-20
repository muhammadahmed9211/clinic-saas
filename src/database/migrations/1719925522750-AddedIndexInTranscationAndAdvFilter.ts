import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedIndexInTranscationAndAdvFilter1719925522750
  implements MigrationInterface
{
  name = 'AddedIndexInTranscationAndAdvFilter1719925522750';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_2ea42332c68a28c1d8bbe632c3" ON "list_view_column" ("listColumnsMetaId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c7c1f076c5395861696e162912" ON "list_view_column" ("listViewFilterId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_95da7837a7fe7d8207f04d82e2" ON "list_column_filter" ("listViewFilterId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dffe1eaeffbbab4b1a9120ae25" ON "list_column_filter" ("listColumnMetaId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4664050cceafa7ab9f0bef8750" ON "list_columns_sort" ("listViewFilterId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_63357f9a68ea8f7f68ab6e3d07" ON "list_columns_sort" ("listColumnMetaId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_450977fcfbe3dd2b0463d64ce8" ON "list_views_filter" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c7358185f370af1ef2f2ff7946" ON "list_views_filter" ("listId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4c65f15812321d39d7e57f250f" ON "list_name" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_211d34eb69685efbb52b581f38" ON "list_columns_meta" ("listId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_830065f5da660c45611fb1b898" ON "list_columns_meta" ("groupId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc542a368602d2ff048062058f" ON "list_columns_group" ("listId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_900eb6b5efaecf57343e4c0e79" ON "transaction" ("walletId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c19716441f3738ab6019cd3d9d" ON "transaction" ("mt5AccountId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_94c75cd58131399b47d119069a" ON "transaction" ("methodId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cd2aeadbce17f8b8af61dda98d" ON "transaction" ("eWalletId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8df13733fb19829f2a5f44b463" ON "transaction" ("creditCardDetailsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_93dfa6d968d87d2c37470b2fd0" ON "transaction" ("exchangeDetailsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f466d05813754249e28d3e6760" ON "transaction" ("companyBankId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_de52b456ac559c8c5368c2fe4e" ON "transaction" ("userBankId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2cae01060a72c5a91bbe26f197" ON "transaction" ("kycRepId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dde178b801b5d058914e6c4ba4" ON "transaction" ("pspId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_629f82cf6e801ebc31b0f8cf43" ON "transaction" ("withdrawRequestId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_698033f6f5784451d4c06d40a6" ON "transaction" ("relatedTransactionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c0d92a491b73292a10dd2ee62" ON "transaction" ("actionById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca20db586f6ab491358cb99cac" ON "transaction" ("evidenceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_47ac8b13f1030ebe4c2da54a8f" ON "transaction" ("salesDeskId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e00bea01c73ff8dc7af159722f" ON "transaction" ("retentionDeskId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ecd7ffc6e69e97a63ed800a809" ON "transaction" ("salesRepId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3b1df296984a6576ac81fe2952" ON "transaction" ("retentionRepId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_3b1df296984a6576ac81fe2952" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_ecd7ffc6e69e97a63ed800a809" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_e00bea01c73ff8dc7af159722f" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_47ac8b13f1030ebe4c2da54a8f" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_ca20db586f6ab491358cb99cac" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_1c0d92a491b73292a10dd2ee62" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_698033f6f5784451d4c06d40a6" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_629f82cf6e801ebc31b0f8cf43" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_dde178b801b5d058914e6c4ba4" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_2cae01060a72c5a91bbe26f197" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_de52b456ac559c8c5368c2fe4e" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f466d05813754249e28d3e6760" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_93dfa6d968d87d2c37470b2fd0" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_8df13733fb19829f2a5f44b463" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_cd2aeadbce17f8b8af61dda98d" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_94c75cd58131399b47d119069a" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_c19716441f3738ab6019cd3d9d" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_900eb6b5efaecf57343e4c0e79" ON "transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_dc542a368602d2ff048062058f" ON "list_columns_group"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_830065f5da660c45611fb1b898" ON "list_columns_meta"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_211d34eb69685efbb52b581f38" ON "list_columns_meta"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_4c65f15812321d39d7e57f250f" ON "list_name"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_c7358185f370af1ef2f2ff7946" ON "list_views_filter"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_450977fcfbe3dd2b0463d64ce8" ON "list_views_filter"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_63357f9a68ea8f7f68ab6e3d07" ON "list_columns_sort"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_4664050cceafa7ab9f0bef8750" ON "list_columns_sort"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_dffe1eaeffbbab4b1a9120ae25" ON "list_column_filter"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_95da7837a7fe7d8207f04d82e2" ON "list_column_filter"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_c7c1f076c5395861696e162912" ON "list_view_column"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_2ea42332c68a28c1d8bbe632c3" ON "list_view_column"`,
    );
  }
}
