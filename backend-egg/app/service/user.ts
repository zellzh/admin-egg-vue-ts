import { Service } from 'egg';
import Manager from '../entity/Manager';

export default class User extends Service {
  // 查询用户
  public async retrieve(userInfo?: any) {
    const { ctx } = this;
    if (userInfo) {
      const {
        username, phone, email,
        key, role, type, origin, limit, offset,
      } = userInfo;
      // 条件查询
      if (key || role || type || origin) {
        console.log(limit, offset);
      } else { // 账号信息查询
        const user = await ctx.repo.Manager.findOne({
          // 数组就是 or 查询
          where: [{ username }, { phone }, { email }],

          // 快捷的关联查询, 通过 entity.prop 可以多级关联查询
          // relations: [ 'oauth', 'mgsRoles', 'roles', 'roles.rights', 'roles.rolesRights' ],
        });
        if (!user) return;
        if (user.username === username) return '用户名已存在';
        if (user.email === email) return '邮箱已存在';
        if (user.phone === phone) return '手机号已存在';
      }
    }
    return ctx.repo.Manager.find();

    // 更多复杂的查询可以使用 builder
    // return ctx.repo.Manager.createQueryBuilder('manager')
    //   .leftJoinAndSelect('manager.mgsRoles', 'mgsRoles')
    //   .leftJoinAndSelect('mgsRoles.role', 'role')
    //   .leftJoinAndSelect('role.rolesRights', 'rolesRights')
    //   .leftJoinAndSelect('rolesRights.rights', 'rights')
    //   .where([{ username }, { phone }, { email }])
    //   .getOne();
  }

  // 删除用户
  public async delete(id: number) {
    const { ctx } = this;
    return ctx.repo.Manager.delete(id);
  }

  // 更新用户
  public async update(userInfo: Manager) {
    const { ctx } = this;
    const { id, email, phone } = userInfo;
    // 删除空串或者未变更的数据
    delete userInfo.id;
    delete userInfo.username;
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
    await ctx.repo.Manager.update(id, userInfo);
  }
}
