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
  // toJSON 方法
  toJSON?() {
    const hideKey = [ 'access_token', 'createdAt', 'updatedAt' ];
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        hideKey.includes(key) && delete this[key];
      }
    }
    return this;
  }

  // 级联: 参数1: 关联表的类型 | 参数2: 关联表的字段 | 参数3?: 关联表的配置项(只需配置一次, JoinTable 无效)
  @ManyToOne(() => Manager, manager => manager.oauth, {
    cascade: true, // 使用 orm 保存主表实体时, 会自动级联保存从表, 无需多表保存
    onUpdate: 'CASCADE', // mysql 主表更新时, 外键级联更新(ManyToMany使用无效)
  })
  @JoinColumn({ // 关系字段的拥有者, 也就是外键
    name: 'mg_id',
  })
  manager?: Manager;

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    comment: '授权令牌',
  })
  access_token?: string;

  @Column({
    comment: '授权的第三方平台',
  })
  provider: string;

  @Column({
    comment: '第三方平台的用户id',
  })
  uid?: number;

  @Column({
    comment: '本地用户id, 外键',
  })
  mg_id: number;

  @CreateDateColumn({ comment: '添加时间', type: 'datetime' })
  createdAt?: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'datetime' })
  updatedAt?: Date;
}
