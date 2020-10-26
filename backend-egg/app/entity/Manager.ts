/*
 * Manager --- 本地用户(管理员)列表
 * 关系: -> Oauth(一对多) | -> Role(多对多)
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import Oauth from './Oauth';
import Role from './Role';

// import MgsRoles from './MgsRoles';

@Entity()
export default class Manager {
  // 添加 toJSON 方法, 转为 JSON 时会自动执行, 过滤掉 密码/...  等敏感信息给前端
  toJSON() {
    const hideKey = [ 'password', 'createdAt', 'updatedAt' ];
    const jsonKey = [ 'roles', 'oauth' ];
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
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

  // 级联
  @ManyToMany(() => Role, role => role.mgs)
  @JoinTable({ // 中间表, 一般给拥有者添加
    name: 'mgs_roles', // 表名
    joinColumn: { name: 'mg_id', referencedColumnName: 'id' }, // 连接当前表的外键
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }, // 连接关联表的外键
  })
  roles: Role[];

  // 自定义中间表
  // @OneToMany(() => MgsRoles, rel => rel.manager)
  // mgsRoles: MgsRoles[];

  @OneToMany(() => Oauth, oauth => oauth.manager) // 一对多三方 Oauth
  oauth: Oauth[];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '用户名',
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    comment: '用户邮箱',
    nullable: true,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
    unique: true,
    comment: '用户手机',
  })
  phone: string;

  @Column({
    comment: '用户密码',
  })
  password: string;

  @Column({
    comment: '是否是github登录',
    default: false,
  })
  github: boolean;

  // CreateDateColumn 默认 type=datetime(6), 保留6位小数
  // Column 自定义时, 需要指定 default: () => 'NOW()' | 'CURRENT_TIMESTAMP'
  @CreateDateColumn({ comment: '添加时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
