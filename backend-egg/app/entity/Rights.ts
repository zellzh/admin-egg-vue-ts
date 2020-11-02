/*
 * Rights --- 权限列表
 * 关系:
 *  Rights -(多对多)-> Role [Rights -(一对多)-> RolesRights...]
 * 权限类型: 菜单权限(menu) | 路由权限(router) | 请求权限(action)
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  // ManyToMany,
} from 'typeorm';
import RolesRights from './RolesRights';
// import Role from './Role';

enum Level {
  first,
  second,
  third,
}

@Entity()
export default class Rights {
  // toJSON 方法
  toJSON?() {
    const hideKey = [ 'createdAt', 'updatedAt' ];
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        hideKey.includes(key) && delete this[key];
      }
    }
    return this;
  }

  // 级联
  // 中间表关联
  @OneToMany(() => RolesRights, rel => rel.rights)
  rightsRoles?: RolesRights[];

  // ManyToMany 关联
  // @ManyToMany(() => Role, role => role.rights) // 反向关联 Role
  // roles: Role[];

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    comment: '权限名称',
  })
  rights_name: string;

  @Column({
    comment: '权限类型',
    nullable: true,
  })
  rights_type?: string;

  @Column({
    comment: '权限描述',
    nullable: true,
  })
  rights_desc?: string;

  @Column({
    comment: '权限是否可用',
    default: true,
  })
  rights_state?: boolean;

  @Column({
    comment: '路由/请求地址',
    nullable: true,
  })
  rights_path?: string;

  @Column({
    comment: '请求方法',
    nullable: true,
  })
  rights_method?: string;

  @Column({
    comment: '父级权限',
    nullable: true,
    unsigned: true,
  })
  pid: number;

  @Column({
    comment: '权限等级',
    default: Level.first,
    enum: Level,
    type: 'enum',
  })
  level: Level; // 枚举类型

  @CreateDateColumn({ comment: '添加时间' })
  createdAt?: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt?: Date;
}
