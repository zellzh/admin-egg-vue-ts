/*
 * MgsRoles --- 用户 | 角色关联表
 * 关系: [MgsRoles -(多对一)-> Manager/Role]
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
import Role from './Role';

@Entity('mgs_roles')
export default class MgsRoles {
  // 中间表级联
  // 关联 Manager
  @ManyToOne(() => Manager, mg => mg.mgsRoles, {
    cascade: true, // 使用 orm 保存主表实体时, 会自动级联保存从表, 无需多表保存
    onUpdate: 'CASCADE', // mysql 主表更新时, 外键级联更新
  })
  @JoinColumn({ // 关联 Manager 的外键
    name: 'mg_id',
  })
  manager: Manager;
  // 关联 Role
  @ManyToOne(() => Role, role => role.rolesMgs, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ // 关联 Role 的外键
    name: 'role_id',
  })
  role: Role;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '关联的用户ID',
  })
  mg_id: number;

  @Column({
    comment: '关联的角色ID',
  })
  role_id: number;

  @CreateDateColumn({ comment: '添加时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
