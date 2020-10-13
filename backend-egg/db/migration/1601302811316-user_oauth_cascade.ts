import { MigrationInterface, QueryRunner } from 'typeorm';

export class userOauthCascade1601302811316 implements MigrationInterface {
  name = 'userOauthCascade1601302811316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `oauth` CHANGE `user_id` `user_id` int NULL COMMENT '本地用户id, 外键'");
    await queryRunner.query('ALTER TABLE `oauth` ADD CONSTRAINT `FK_c1e31b84cedaa9135fd13ca1620` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `oauth` DROP FOREIGN KEY `FK_c1e31b84cedaa9135fd13ca1620`');
    await queryRunner.query("ALTER TABLE `oauth` CHANGE `user_id` `user_id` int NOT NULL COMMENT '本地的用户id'");
  }

}
