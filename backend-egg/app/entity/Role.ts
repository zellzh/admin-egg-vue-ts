/*
 * Role --- 角色列表
 * 关系: Role -> Rights(多对多) | Manager -> Role(多对多)
 * 从属关系不同, 决定映射对象属性也不同, 比如: manager: { roles: [ { rights: [] } ] }
 * 为了防止重复, 可以使用两张中间表做关联
 * 注: 需要快捷创建中间表时, 中间表除了外键无多余字段, 可以直接使用 ManyToMany 装饰器
 *
 * 需要自定义中间表时:
 * 1.手动创建一个自定义的中间表
 * 2.可以直接使用 ManyToMany, 结构清晰简单, 无需映射
 *   但是要手动修改 migration 迁移文件, 删除多余建表操作, 修改中间表的 cascade 配置...
 * 3.也可以使用 OneToMany | ManyToOne 建立关联表的联系, 无需修改 migration
 *   但是查询时只能通过中间表进行关联查询, 查询结构复杂, 需要额外映射结构
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  // OneToMany,
} from 'typeorm';
import Manager from './Manager';
import Rights from './Rights';

// 自定义中间表
// import MgsRoles from './MgsRoles';
// import RolesRights from './RolesRights';

@Entity()
export default class Role {
  // toJSON 方法
  toJSON() {
    const hideKey = [ 'createdAt', 'updatedAt' ];
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        hideKey.includes(key) && delete this[key];
      }
    }
    return this;
  }

  // 级联
  @ManyToMany(() => Manager, mg => mg.roles) // 反向关联 Manager
  mgs: Manager[];

  // 自定义中间表
  // @OneToMany(() => MgsRoles, rel => rel.role) // 自定义中间表
  // mgsRoles: MgsRoles[];
  // @OneToMany(() => RolesRights, rel => rel.rights) // 自定义中间表
  // roleRights: RolesRights[];

  @ManyToMany(() => Rights, rights => rights.roles)
  @JoinTable({
    name: 'roles_rights',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'rights_id', referencedColumnName: 'id' },
  })
  rights: Rights[];

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
