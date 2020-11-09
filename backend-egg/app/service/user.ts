import { Service } from 'egg';
import Manager from '../entity/Manager';
import { Brackets } from 'typeorm';

export default class User extends Service {
  // 查询用户
  public async retrieve(userInfo?: any) {
    const { ctx } = this;
    if (!Object.keys(userInfo).length) return ctx.repo.Manager.find();
    const {
      username, phone, email,
      key, role, type, origin,
      limit = 5, offset = 1,
    } = userInfo;
    /* 账号信息查询
       ========================================================== */
    if (username || phone || email) {
      const user = await ctx.repo.Manager.findOne({
        // 数组就是 or 查询
        where: [{ username }, { phone }, { email }],
      });
      if (!user) return;
      if (user.username === username) return '用户名已存在';
      if (user.email === email) return '邮箱已存在';
      if (user.phone === phone) return '手机号已存在';
    } else {
    /* 分页查询
     ========================================================== */
      /*
      注意点:
        - where 查询默认是外层的 AND|OR 查询
        - new Brackets 可以将多个条件整合为一个条件
        - 根据字段存在与否来使用条件查询时, 可以用三目运算符结合 true 来查询
          否则会生成空的 AND|OR 查询, 导致查询错误
       */
      role && console.log(role);
      return await ctx.repo.Manager.createQueryBuilder()
        .where(key && new Brackets(qb => {
          qb.where('username LIKE :key', { key: `%${key}%` })
            .orWhere('email LIKE :key')
            .orWhere('phone LIKE :key');
        }))
        .andWhere(type ? `${type} LIKE :key` : 'true')
        .andWhere(origin ? `${origin} = true` : 'true')
        .skip((offset - 1) * limit)
        .take(limit)
        .getMany();
    }
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
      const res = await ctx.repo.Manager.findOne({ email });
      if (res && res.id !== id) return '邮箱已存在';
    } else {
      delete userInfo.email;
    }
    if (phone) {
      const res = await ctx.repo.Manager.findOne({ phone });
      if (res && res.id !== id) return '手机号已存在';
    } else {
      delete userInfo.phone;
    }
    await ctx.repo.Manager.update(id, {
      email,
      phone,
      avatar,
      state,
    });
  }
}
