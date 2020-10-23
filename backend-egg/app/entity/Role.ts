/*
 * Role --- 角色列表
 * 关系: -> Rights(多对多) | -> Manager(多对多)
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import Rights from './Rights';
import Manager from './Manager';

@Entity()
export default class Role {
  // 级联
  @ManyToMany(() => Rights, rights => rights.roles)
  // 保存关系的表, 即关联表(多对多的表中任意选张表定义即可, 一般给拥有者配置, 默认会用该表名开头命名)
  // 自动创建的关系表无法自定义字段, 可以手动创建关联表, 通过一对多+多对一来跟关系表级联(繁琐点)
  @JoinTable({
    // 关系表的表名
    name: 'manager_role_rights',
    // 关联当前表的外键
    joinColumns: [
      { name: 'role_id' }, // 角色 Role
    ],
    // 关联其他表的外键
    inverseJoinColumns: [
      { name: 'rights_id' }, // 权限 Rights
    ],
  })
  rights: Rights[];

  @ManyToMany(() => Manager, mg => mg.roles)
  @JoinTable({
    // 关系表的表名
    name: 'manager_role_rights',
    // 关联当前表的外键
    joinColumns: [
      { name: 'role_id' }, // 角色 Role
    ],
    // 关联其他表的外键
    inverseJoinColumns: [
      { name: 'mg_id' }, // 用户 Manager
    ],
  })
  manager: Manager[];

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
