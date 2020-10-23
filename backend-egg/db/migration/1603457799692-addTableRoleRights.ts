import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTableRoleRights1603457799692 implements MigrationInterface {
  name = 'addTableRoleRights1603457799692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE TABLE `rights` (`id` int NOT NULL AUTO_INCREMENT, `rights_name` varchar(255) NOT NULL COMMENT '权限名称', `rights_type` varchar(255) NOT NULL COMMENT '权限类型', `rights_desc` varchar(255) NULL COMMENT '权限描述', `rights_state` tinyint NOT NULL COMMENT '权限是否可用' DEFAULT 1, `rights_path` varchar(255) NULL COMMENT '路由/请求地址', `rights_method` varchar(255) NULL COMMENT '请求方法', `pid` int NULL COMMENT '父级权限', `level` enum ('0', '1', '2') NOT NULL COMMENT '权限等级' DEFAULT '0', `createdAt` datetime(6) NOT NULL COMMENT '添加时间' DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    await queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, `role_name` varchar(255) NOT NULL COMMENT '角色名称', `role_desc` varchar(255) NULL COMMENT '角色描述', `role_state` tinyint NOT NULL COMMENT '角色是否可用' DEFAULT 1, `createdAt` datetime(6) NOT NULL COMMENT '添加时间' DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_4810bc474fe6394c6f58cb7c9e` (`role_name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    await queryRunner.query("CREATE TABLE `manager_role_rights` (`id` int NOT NULL AUTO_INCREMENT, `mg_id` int NOT NULL COMMENT '关联的用户ID', `role_id` int NOT NULL COMMENT '关联的角色ID', `rights_id` int NOT NULL COMMENT '关联的权限ID', `createdAt` datetime(6) NOT NULL COMMENT '添加时间' DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    await queryRunner.query('ALTER TABLE `manager_role_rights` ADD CONSTRAINT `FK_9254da4a7108393fb676288b0d9` FOREIGN KEY (`mg_id`) REFERENCES `manager`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE `manager_role_rights` ADD CONSTRAINT `FK_272b0284a669ba09ecd091e1785` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE `manager_role_rights` ADD CONSTRAINT `FK_f91f7acd4c6afaef5f4cfd86b9d` FOREIGN KEY (`rights_id`) REFERENCES `rights`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `manager_role_rights` DROP FOREIGN KEY `FK_f91f7acd4c6afaef5f4cfd86b9d`');
    await queryRunner.query('ALTER TABLE `manager_role_rights` DROP FOREIGN KEY `FK_272b0284a669ba09ecd091e1785`');
    await queryRunner.query('ALTER TABLE `manager_role_rights` DROP FOREIGN KEY `FK_9254da4a7108393fb676288b0d9`');
    await queryRunner.query('DROP TABLE `manager_role_rights`');
    await queryRunner.query('DROP INDEX `IDX_4810bc474fe6394c6f58cb7c9e` ON `role`');
    await queryRunner.query('DROP TABLE `role`');
    await queryRunner.query('DROP TABLE `rights`');
  }

}
