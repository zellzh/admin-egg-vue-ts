import { Service } from 'egg';
import Manager from '../entity/Manager';

export default class ManagerService extends Service {
  // 保存用户数据
  public async create(user: Manager) {
    const { ctx } = this;
    // 删除空串, 防止不必要的bug
    ctx.deleteEmpty(user);
    // 密码加密
    user.password = await ctx.helper.bcrypt(user.password);
    // 保存数据
    user = ctx.repo.Manager.create(user);
    return ctx.repo.Manager.save(user);
  }

  // 查询用户
  public async retrieve(user: Manager) {
    const { ctx } = this;
    const { username, phone, email } = user;
    return ctx.repo.Manager.findOne({
      // 数组就是 or 查询
      where: [{ username }, { phone }, { email }],
    });
  }
}
