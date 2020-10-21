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
  @JoinColumn({ // 只能给外键使用
    name: 'mg_id',
  })
  manager: Manager;

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
  mg_id: number;

  @CreateDateColumn({ comment: '添加时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
