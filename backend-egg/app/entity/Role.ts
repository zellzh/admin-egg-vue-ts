/*
 * Role --- 角色列表
 * 关系:
 *  Role -(多对多)-> Manager [Role -(一对多)-> MgsRoles...]
 *  Role -(多对多)-> Rights [Role -(一对多)-> RolesRights -(多对一)-> Rights]
 * 关联关系不同, 决定映射对象的结构也不同
 * 注: 需要快捷创建中间表时, 中间表除了外键无多余字段, 可以直接使用 ManyToMany 装饰器
 * 比如:
 *  ManyToMany: manager: { roles: [ { rights: [] } ] }
 *  OneToMany: manager: { mgsRoles: [ { role: { rights: [] } } ] }
 */
/* typeorm 多对多关联注意点--
 * 使用 typeorm 自定义中间表(既然自定义中间表, 建议使用 OneToMany):
 * 1.手动创建一个自定义的中间表
 * 2.可以直接使用 ManyToMany:
 *   优点: 查询和结构简单, 无需再映射结构, 不过想知道中间表信息, 需要使用 OneToMany 给中间表关联
 *   缺点:
 *    要手动修改 migration 迁移文件, 删除多余建表操作, 修改中间表的 cascade 配置(ManyToMany 无法通过 opts 变更中间表)...
 *    每次 migration 都要修改, 比较麻烦
 * 3.也可以使用 OneToMany | ManyToOne 分别建立表和中间表的联系(自定义推荐)
 *   优点: 建表逻辑清晰, 无需修改 migration, 关联查询一定会查到中间表信息
 *   缺点: 关联查询时必须通过中间表, 查询和结构复杂, 需要额外映射处理结构
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  // ManyToMany,
  // JoinTable,
  // AfterRemove,
  // AfterUpdate,
  // AfterLoad,
  // AfterInsert,
} from 'typeorm';
// ManyToMany 关联
// import Manager from './Manager';
// import Rights from './Rights';

// 中间表关联
import MgsRoles from './MgsRoles';
import RolesRights from './RolesRights';

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

  // 级联: ManyToMany 和 OneToMany 结合使用, 可以快捷查询中间表
  // 中间表关联
  @OneToMany(() => MgsRoles, rel => rel.role) // Manager_Role
  rolesMgs: MgsRoles[];
  @OneToMany(() => RolesRights, rel => rel.role) // Role_Rights
  rolesRights: RolesRights[];
  // 映射
  // @AfterRemove()
  // @AfterUpdate()
  // @AfterLoad()
  // @AfterInsert()
  // getRights() {
  //   if (this.rolesRights && this.rolesRights.length !== 0) {
  //     this.rights = this.rolesRights.map(rel => rel.rights);
  //   } else {
  //     this.rights = [];
  //   }
  // }
  // rights?: Rights[];

  // ManyToMany 关联
  // @ManyToMany(() => Manager, mg => mg.roles) // 反向关联 Manager
  // mgs: Manager[];
  // @ManyToMany(() => Rights, rights => rights.roles)
  // @JoinTable({
  //   name: 'roles_rights',
  //   joinColumn: { name: 'role_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'rights_id', referencedColumnName: 'id' },
  // })
  // rights: Rights[];

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
