/*
 * Manager_Role_Rights --- 用户 | 角色 | 权限关联表
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Manager_Role_Rights {
  name: 'manager_role_rights'; // 表名

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
