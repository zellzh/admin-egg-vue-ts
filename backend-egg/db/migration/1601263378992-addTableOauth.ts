import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTableOauth1601263378992 implements MigrationInterface {
  name = 'addTableOauth1601263378992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE TABLE `oauth` (`id` int NOT NULL AUTO_INCREMENT, `access_token` varchar(255) NOT NULL COMMENT '授权令牌', `provider` varchar(255) NOT NULL COMMENT '授权的第三方平台', `uid` int NOT NULL COMMENT '第三方平台的用户id', `mg_id` int NOT NULL COMMENT '本地的用户id', `createdAt` datetime(6) NOT NULL COMMENT '添加时间' DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    await queryRunner.query('ALTER TABLE `oauth` ADD CONSTRAINT `FK_17c15987433b2c55528f94b724f` FOREIGN KEY (`mg_id`) REFERENCES `manager`(`id`) ON UPDATE CASCADE');

    await queryRunner.query("ALTER TABLE `manager` ADD `github` tinyint NOT NULL COMMENT '是否是github登录' DEFAULT 0");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `manager` DROP COLUMN `github`');
    await queryRunner.query('ALTER TABLE `oauth` DROP FOREIGN KEY `oauth_ibfk_1`');
    await queryRunner.query('DROP TABLE `oauth`');
  }

}
