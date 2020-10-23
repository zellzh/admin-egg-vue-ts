/*
 * Manager_Role_Rights --- 自定义用户 | 角色 | 权限关联表
 * 注: 通过 manytoone 来手动建立关系
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
import Rights from './Rights';
import Role from './Role';

@Entity()
export default class ManagerRoleRights {
  // 级联
  @ManyToOne(() => Manager, mg => mg.mrr)
  @JoinColumn({ // 关联 Manager 的外键
    name: 'mg_id',
  })
  manager: Manager;

  @ManyToOne(() => Role, role => role.mrr)
  @JoinColumn({ // 关联 Role 的外键
    name: 'role_id',
  })
  role: Role;

  @ManyToOne(() => Rights, rights => rights.mrr)
  @JoinColumn({ // 关联 Rights 的外键
    name: 'rights_id',
  })
  rights: Rights;

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

  @Column({
    comment: '关联的权限ID',
  })
  rights_id: number;

  @CreateDateColumn({ comment: '添加时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
