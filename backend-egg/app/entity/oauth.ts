import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './user';

@Entity()
export default class Oauth {
  // 级联
  @ManyToOne(() => User, user => user.oauth) // 第一个参数是类型, 第二个是关联字段
  @JoinColumn({ // 只能给外键使用
    name: 'user_id',
  })
  user: User;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '授权令牌',
    nullable: false,
  })
  access_token: string;

  @Column({
    comment: '授权的第三方平台',
    nullable: false,
    unique: false,
  })
  provider: string;

  @Column({
    comment: '第三方平台的用户id',
    nullable: false,
    unique: false,
  })
  uid: number;

  @Column({
    comment: '本地用户id, 外键',
  })
  user_id: number;

  @CreateDateColumn({ comment: '添加时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
