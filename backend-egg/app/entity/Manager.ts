/*
 * Manager --- 本地用户(管理员)列表
 * 关系: -> Oauth(一对多) | -> Role(多对多)
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Oauth from './Oauth';
import MRR from './Manager_Role_Rights';

@Entity()
export default class Manager {
  // 添加 toJSON 方法, 转为 JSON 时会自动执行, 过滤掉 密码/...  等敏感信息给前端
  toJSON() {
    delete this.password;
    delete this.createdAt;
    delete this.updatedAt;
    return this;
  }
  // 级联
  @OneToMany(() => MRR, mrr => mrr.manager) // 一对多关联表
  mrr: MRR[];

  @OneToMany(() => Oauth, oauth => oauth.manager) // 一对多三方 Oauth
  oauth: Oauth[];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '用户名',
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    comment: '用户邮箱',
    nullable: true,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
    unique: true,
    comment: '用户手机',
  })
  phone: string;

  @Column({
    comment: '用户密码',
  })
  password: string;

  @Column({
    comment: '是否是github登录',
    default: false,
  })
  github: boolean;

  @CreateDateColumn({ comment: '添加时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
