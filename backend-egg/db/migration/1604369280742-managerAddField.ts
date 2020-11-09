/*
 * manager --- 添加字段 avatar & state
 */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class managerAddField1604369280742 implements MigrationInterface {
  name = 'managerAddField1604369280742';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `manager` ADD `state` tinyint NOT NULL COMMENT '用户是否可用(注销)' DEFAULT 1");
    await queryRunner.query("ALTER TABLE `manager` ADD `avatar` varchar(255) NULL COMMENT '用户头像地址'");
    await queryRunner.query("ALTER TABLE `manager` ADD `local` tinyint NOT NULL COMMENT '是否本地注册' DEFAULT 1");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `manager` DROP COLUMN `avatar`');
    await queryRunner.query('ALTER TABLE `manager` DROP COLUMN `state`');
    await queryRunner.query('ALTER TABLE `manager` DROP COLUMN `local`');
  }

}
