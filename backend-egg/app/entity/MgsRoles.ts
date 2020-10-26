/*
 * Mgs_Roles --- 用户 | 角色关联表
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
// import Manager from './Manager';
// import Role from './Role';

@Entity({ name: 'mgs_roles' })
export default class MgsRoles {
  // 自定义级联
  // @ManyToOne(() => Manager, mg => mg.mgsRoles)
  // @JoinColumn({ // 关联 Manager 的外键
  //   name: 'mg_id',
  // })
  // manager: Manager;
  // @ManyToOne(() => Role, role => role.mgsRoles)
  // @JoinColumn({ // 关联 Role 的外键
  //   name: 'role_id',
  // })
  // role: Role;

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
