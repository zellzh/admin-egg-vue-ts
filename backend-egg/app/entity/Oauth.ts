/*
 * Oauth --- 三方授权列表
 * 关系: -> Manager(多对一)
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Manager from './Manager';

@Entity()
export default class Oauth {
  // 级联
  @ManyToOne(() => Manager, manager => manager.oauth) // 第一个参数是类型, 第二个是关联字段
  @JoinColumn({ // 关系字段的拥有者, 也就是外键
    name: 'mg_id',
  })
  manager: Manager;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '授权令牌',
  })
  access_token: string;

  @Column({
    comment: '授权的第三方平台',
  })
  provider: string;

  @Column({
    comment: '第三方平台的用户id',
  })
  uid: number;

  @Column({
    comment: '本地用户id, 外键',
  })
  mg_id: number;

  @CreateDateColumn({ comment: '添加时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
