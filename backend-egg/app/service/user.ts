import { Service } from 'egg';
import Manager from '../entity/Manager';
import { Brackets } from 'typeorm';

export default class User extends Service {
  // 查询用户
  public async retrieve(user?: Partial<Manager>) {
    const { ctx } = this;
    if (!user) return ctx.repo.Manager.find();
    const { username, email, phone } = user;
    const dbUser = await ctx.repo.Manager.findOne({
      // 数组就是 or 查询
      where: [{ username }, { phone }, { email }],
    });
    if (!dbUser) return;
    if (dbUser.username === username) return '用户名已存在';
    if (dbUser.email === email) return '邮箱已存在';
    if (dbUser.phone === phone) return '手机号已存在';
  }
  // 分页查询
  public async searchQuery(userInfo: any) {
    const { ctx } = this;
    const {
      key, role, type, origin,
      limit = 5, offset = 1,
    } = userInfo;

    /*
     * 注意点:
     *  - 条件查询中有关联表的字段, 所以条件查询需要在关联查询的结果中获取
     *  - 如果直接查询, 无法查询到满足条件的所有关联角色
     */
    const conditionQuery = await ctx.repo.Manager.createQueryBuilder()
      .select('user.id')
      .from(Manager, 'user')
      .leftJoin('mgs_roles', 'rel', 'rel.mg_id = user.id')
      .leftJoin('role', 'role', 'rel.role_id = role.id')
      .where(key && new Brackets(qb => {
        qb.where('user.username LIKE :key')
          .orWhere('user.email LIKE :key')
          .orWhere('user.phone LIKE :key');
      }))
      .andWhere(type ? `user.${type} LIKE :key` : 'true')
      .andWhere(origin ? `user.${origin} = true` : 'true')
      .andWhere(role ? 'role.role_name = :role' : 'true');

    /*
    注意点:
      - where 查询默认是外层的 AND|OR 查询
      - new Brackets 可以将多个条件整合为一个条件
      - 根据字段存在与否来使用条件查询时, 可以用三目运算符结合 true 来查询
        否则会生成空的 AND|OR 查询, 导致查询错误
     */
    const [ res, count ] = await ctx.repo.Manager.createQueryBuilder('user')
      // 先通过关联关系查询到中间表
      .leftJoinAndSelect('user.mgsRoles', 'rel')
      // 再通过中间表的 role_id = role.id 条件将查询的结果映射到 user.roles
      .leftJoinAndMapMany('user.roles', 'role', 'role', 'rel.role_id = role.id')
      .where('user.id IN (' + conditionQuery.getQuery() + ')')
      .setParameters({ key: `%${key}%`, role })
      .orderBy('user.id')
      .skip((offset - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { users: res, count };
  }

  // 删除用户
  public async delete(id: number) {
    const { ctx } = this;
    return ctx.repo.Manager.delete(id);
  }

  // 更新用户
  public async update(id: number, userInfo: Partial<Manager>) {
    const { ctx } = this;
    const { email, phone, avatar, state } = userInfo;
    // 删除空串或者未变更的数据
    delete userInfo.username;
    avatar || delete userInfo.avatar;
    if (email) {
      const res = await ctx.repo.Manager.findOne({ email } as any);
      if (res && res.id !== id) return '邮箱已存在';
    } else {
      delete userInfo.email;
    }
    if (phone) {
      const res = await ctx.repo.Manager.findOne({ phone } as any);
      if (res && res.id !== id) return '手机号已存在';
    } else {
      delete userInfo.phone;
    }
    await ctx.repo.Manager.update(id, {
      email,
      phone,
      avatar,
      state,
    } as any);
  }
}
