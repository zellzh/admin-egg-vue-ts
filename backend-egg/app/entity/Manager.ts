/*
 * Manager --- 本地用户(管理员)列表
 * 关系:
 *  Manager -(一对多)-> Oauth
 *  Manager -(多对多)-> Role [Manager -(一对多)-> MgsRoles -(多对一)-> Role]
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
} from 'typeorm';
import Oauth from './Oauth';
import Role from './Role';
import Rights from './Rights';
import MgsRoles from './MgsRoles';

@Entity()
export default class Manager {
  // 添加 toJSON 方法, 转为 JSON 时会自动执行, 过滤掉 密码/...  等敏感信息给前端
  toJSON?() {
    const hideKey = [ 'password', 'createdAt', 'updatedAt' ];
    const jsonKey = [ 'roles', 'oauth' ];
    this.baseUrl = 'http://127.0.0.1:7001'; // 设置后端地址
    for (const key in this) {
      if (this.hasOwnProperty(key)) { // 调用属性对象的 toJSON()
        if (jsonKey.includes(key)) {
          // Array.isArray(this[key]) ?
          // (<any> this[key]).forEach(item => item.toJSON()) :
          // (<any> this[key]).toJSON();
        } else {
          hideKey.includes(key) && delete this[key];
        }
      }
    }
    return this;
  }
  baseUrl?: string;
  [prop: string]: any;

  // 级联: ManyToMany 和 OneToMany 结合使用, 可以快捷查询中间表
  @OneToMany(() => Oauth, oauth => oauth.manager) // 一对多 Oauth
  oauth: Oauth[];

  // 中间表关联
  @OneToMany(() => MgsRoles, rel => rel.manager)
  mgsRoles: MgsRoles[];

  /*
   * 通过中间表查询和关联映射查询来实现 manyToOne+oneToMany 结构的映射
   *  queryBuilder.leftJoinAndSelect(关联字段:'mgsRoles', 关联实体别名:'rel')
   *  queryBuilder.leftJoinAndMapMany(映射属性:'roles', 源属性/实体:'role', 源实体别名:'role', 映射条件:'rel.role_id = role.id')
   * 将关联表中的 role 映射到 roles 中
   */
  roles?: Role[];
  rights?: Rights[];
  rightsTree?: Rights[];

  // ManyToMany 关联
  // @ManyToMany(() => Role, role => role.mgs)
  // @JoinTable({ // 中间表, 一般给拥有者添加
  //   name: 'mgs_roles', // 表名
  //   joinColumn: { name: 'mg_id', referencedColumnName: 'id' }, // 连接当前表的外键
  //   inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }, // 连接关联表的外键
  // })
  // roles: Role[];

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    comment: '用户名',
    nullable: true,
    unique: true,
  })
  username?: string;

  @Column({
    comment: '用户邮箱',
    nullable: true,
    unique: true,
  })
  email?: string;

  @Column({
    nullable: true,
    unique: true,
    comment: '用户手机',
  })
  phone?: string;

  @Column({
    comment: '用户密码',
  })
  password?: string;

  @Column({
    comment: '是否github登录',
    default: false,
  })
  github?: boolean;

  @Column({
    comment: '是否本地注册',
    default: true,
  })
  local?: boolean;

  @Column({
    comment: '用户是否可用(注销)',
    default: true,
  })
  state?: boolean;

  @Column({
    comment: '用户头像地址',
    nullable: true,
  })
  avatar?: string;

  // CreateDateColumn 默认 type=datetime(6), 保留6位小数
  // Column 自定义时, 需要指定 default: () => 'NOW()' | 'CURRENT_TIMESTAMP'
  @CreateDateColumn({ comment: '添加时间' })
  createdAt?: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt?: Date;
}
