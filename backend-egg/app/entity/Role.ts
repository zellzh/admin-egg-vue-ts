/*
 * Role --- 角色列表
 * 关系: -> Rights(多对多) | -> Manager(多对多)
 * 注: 可以直接使用 typeorm 的 manytomany 装饰器, 但是无法自定义添加字段, 用于快捷创建中间表
 *    需要自定义字段等, 可以手动创建一个中间表, 使用一对多+多对一建立多张表的关系
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import MRR from './Manager_Role_Rights';

@Entity()
export default class Role {
  // 级联
  @OneToMany(() => MRR, mrr => mrr.role)
  mrr: MRR[];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '角色名称',
    unique: true,
  })
  role_name: string;

  @Column({
    comment: '角色描述',
    nullable: true,
  })
  role_desc: string;

  @Column({
    comment: '角色是否可用',
    default: true,
  })
  role_state: boolean;

  @CreateDateColumn({ comment: '添加时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
