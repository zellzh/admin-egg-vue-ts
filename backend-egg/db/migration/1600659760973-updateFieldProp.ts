import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class updateFieldProp1600659760973 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('user', 'password', new TableColumn({
      name: 'password',
      type: 'varchar',
      isUnique: false,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('user', 'password', new TableColumn({
      name: 'password',
      type: 'varchar',
      isUnique: true,
    }));
  }

}
