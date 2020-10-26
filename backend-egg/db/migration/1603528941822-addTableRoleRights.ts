/*
 * 需要自定义中间表时:
 * 1.手动创建一个自定义的中间表
 * 2.可以直接使用 ManyToMany, 结构清晰简单, 无需映射
 *   但是要手动修改 migration 迁移文件, 删除多余建表操作, 修改中间表的 cascade 配置...
 * 3.也可以使用 OneToMany | ManyToOne 建立关联表的联系, 无需修改 migration
 *   但是查询时只能通过中间表进行关联查询, 查询结构复杂, 需要额外映射结构
 */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTableRoleRights1603528941822 implements MigrationInterface {
  name = 'addTableRoleRights1603528941822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE TABLE `rights` (`id` int NOT NULL AUTO_INCREMENT, `rights_name` varchar(255) NOT NULL COMMENT '权限名称', `rights_type` varchar(255) NULL COMMENT '权限类型', `rights_desc` varchar(255) NULL COMMENT '权限描述', `rights_state` tinyint NOT NULL COMMENT '权限是否可用' DEFAULT 1, `rights_path` varchar(255) NULL COMMENT '路由/请求地址', `rights_method` varchar(255) NULL COMMENT '请求方法', `pid` int UNSIGNED NULL COMMENT '父级权限', `level` enum ('0', '1', '2') NOT NULL COMMENT '权限等级' DEFAULT '0', `createdAt` datetime(6) NOT NULL COMMENT '添加时间' DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    await queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, `role_name` varchar(255) NOT NULL COMMENT '角色名称', `role_desc` varchar(255) NULL COMMENT '角色描述', `role_state` tinyint NOT NULL COMMENT '角色是否可用' DEFAULT 1, `createdAt` datetime(6) NOT NULL COMMENT '添加时间' DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_4810bc474fe6394c6f58cb7c9e` (`role_name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    await queryRunner.query("CREATE TABLE `mgs_roles` (`id` int NOT NULL AUTO_INCREMENT, `mg_id` int NOT NULL COMMENT '关联的用户ID', `role_id` int NOT NULL COMMENT '关联的角色ID', `createdAt` datetime(6) NOT NULL COMMENT '添加时间' DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    await queryRunner.query("CREATE TABLE `roles_rights` (`id` int NOT NULL AUTO_INCREMENT, `role_id` int NOT NULL COMMENT '关联的角色ID', `rights_id` int NOT NULL COMMENT '关联的权限ID', `createdAt` datetime(6) NOT NULL COMMENT '添加时间' DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    // 删除多余的建表操作...

    await queryRunner.query('CREATE INDEX `IDX_8e8a75e25b2436a876d0a5345f` ON `roles_rights` (`role_id`)');
    await queryRunner.query('CREATE INDEX `IDX_16fea66fdff546997fe5546aa1` ON `roles_rights` (`rights_id`)');
    await queryRunner.query('CREATE INDEX `IDX_7c18feabd30983765cd2241aa5` ON `mgs_roles` (`mg_id`)');
    await queryRunner.query('CREATE INDEX `IDX_b3c7afe6a55ec52e862e88560c` ON `mgs_roles` (`role_id`)');
    // 修改 update cascade
    await queryRunner.query('ALTER TABLE `roles_rights` ADD CONSTRAINT `FK_8e8a75e25b2436a876d0a5345f5` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE `roles_rights` ADD CONSTRAINT `FK_16fea66fdff546997fe5546aa11` FOREIGN KEY (`rights_id`) REFERENCES `rights`(`id`) ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE `mgs_roles` ADD CONSTRAINT `FK_7c18feabd30983765cd2241aa56` FOREIGN KEY (`mg_id`) REFERENCES `manager`(`id`) ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE `mgs_roles` ADD CONSTRAINT `FK_b3c7afe6a55ec52e862e88560c2` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `mgs_roles` DROP FOREIGN KEY `FK_b3c7afe6a55ec52e862e88560c2`');
    await queryRunner.query('ALTER TABLE `mgs_roles` DROP FOREIGN KEY `FK_7c18feabd30983765cd2241aa56`');
    await queryRunner.query('ALTER TABLE `roles_rights` DROP FOREIGN KEY `FK_16fea66fdff546997fe5546aa11`');
    await queryRunner.query('ALTER TABLE `roles_rights` DROP FOREIGN KEY `FK_8e8a75e25b2436a876d0a5345f5`');
    await queryRunner.query('DROP INDEX `IDX_b3c7afe6a55ec52e862e88560c` ON `mgs_roles`');
    await queryRunner.query('DROP INDEX `IDX_7c18feabd30983765cd2241aa5` ON `mgs_roles`');
    await queryRunner.query('DROP INDEX `IDX_16fea66fdff546997fe5546aa1` ON `roles_rights`');
    await queryRunner.query('DROP INDEX `IDX_8e8a75e25b2436a876d0a5345f` ON `roles_rights`');
    // 删除多余的建表操作...

    await queryRunner.query('DROP TABLE `roles_rights`');
    await queryRunner.query('DROP TABLE `mgs_roles`');
    await queryRunner.query('DROP INDEX `IDX_4810bc474fe6394c6f58cb7c9e` ON `role`');
    await queryRunner.query('DROP TABLE `role`');
    await queryRunner.query('DROP TABLE `rights`');
  }

}
