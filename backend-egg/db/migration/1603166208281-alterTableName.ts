import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterTableName1603166208281 implements MigrationInterface {
  name = 'alterTableName1603166208281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('user', 'manager');
    await queryRunner.changeColumn('oauth', 'user_id', new TableColumn({
      name: 'mg_id',
      type: 'int',
      comment: '本地用户id, 外键',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('manager', 'user');
    await queryRunner.changeColumn('oauth', 'mg_id', new TableColumn({
      name: 'user_id',
      type: 'int',
      comment: '本地用户id, 外键',
    }));
  }

}
