import { MigrationInterface, QueryRunner } from 'typeorm';

export class createManager1599708433682 implements MigrationInterface {
  name = 'createManager1599708433682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE TABLE `manager` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NULL COMMENT '用户名', `email` varchar(255) NULL COMMENT '用户邮箱', `phone` varchar(255) NULL COMMENT '用户手机', `password` varchar(255) NOT NULL COMMENT '用户密码', `createdAt` datetime NOT NULL COMMENT '添加时间' DEFAULT NOW(), `updatedAt` datetime NOT NULL COMMENT '更新时间' DEFAULT NOW(), UNIQUE INDEX `IDX_50842d4e3e27344504cad8769e` (`username`), UNIQUE INDEX `IDX_ee8fba4edb704ce2465753a2ed` (`email`), UNIQUE INDEX `IDX_699a0925afd794c80ed83ee906` (`phone`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `manager`');
  }

}
