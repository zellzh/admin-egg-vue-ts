import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '用户名',
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    nullable: true,
    unique: true,
    comment: '用户邮箱',
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
    nullable: false,
    unique: false,
  })
  password: string;

  @CreateDateColumn({ comment: '添加时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
