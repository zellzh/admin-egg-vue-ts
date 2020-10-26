/*
 * Roles_Rights ---  角色 | 权限关联表
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  // ManyToOne,
  // JoinColumn,
} from 'typeorm';
// import Role from './Role';
// import Rights from './Rights';

@Entity({ name: 'roles_rights' })
export default class RolesRights {
  // 自定义级联
  // @ManyToOne(() => Role, role => role.roleRights)
  // @JoinColumn({ // 关联 Role 的外键
  //   name: 'role_id',
  // })
  // role: Role;
  // @ManyToOne(() => Rights, rights => rights.rolesRights)
  // @JoinColumn({ // 关联 Rights 的外键
  //   name: 'rights_id',
  // })
  // rights: Rights;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '关联的角色ID',
  })
  role_id: number;

  @Column({
    comment: '关联的权限ID',
  })
  rights_id: number;

  @CreateDateColumn({ comment: '添加时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
