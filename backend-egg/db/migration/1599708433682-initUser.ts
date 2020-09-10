import {MigrationInterface, QueryRunner} from "typeorm";

export class changeUser1599708433682 implements MigrationInterface {
    name = 'initUser1599708433682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NULL COMMENT '用户名', `email` varchar(255) NULL COMMENT '用户邮箱', `phone` varchar(255) NULL COMMENT '用户手机', `password` varchar(255) NOT NULL COMMENT '用户密码', `createdAt` datetime(6) NOT NULL COMMENT '添加时间' DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), UNIQUE INDEX `IDX_8e1f623798118e629b46a9e629` (`phone`), UNIQUE INDEX `IDX_638bac731294171648258260ff` (`password`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `user`");
    }

}
