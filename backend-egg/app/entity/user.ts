import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Oauth from './oauth';

enum OauthTrigger{
  off,
  on,
}

@Entity()
export default class User {
  // 添加 toJSON 方法, 转为 JSON 时会自动执行, 过滤掉 密码/...  等敏感信息给前端
  toJSON() {
    delete this.password;
    delete this.createdAt;
    delete this.updatedAt;
    return this;
  }
  // 级联
  @OneToMany(() => Oauth, oauth => oauth.user)
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
    nullable: true,
    unique: true,
    comment: '用户邮箱',
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
    nullable: false,
    unique: false,
  })
  password: string;

  @Column({
    comment: 'github登录',
    type: 'enum',
    enum: OauthTrigger,
    unique: false,
    nullable: false,
    default: OauthTrigger.off,
  })
  github: Oauth; // 枚举类型

  @CreateDateColumn({ comment: '添加时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
