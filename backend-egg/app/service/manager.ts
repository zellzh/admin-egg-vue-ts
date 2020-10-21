import { Service } from 'egg';

export default class Manager extends Service {
  // 保存用户数据
  public async createUser(user) {
    const { ctx } = this;
    // 密码加密
    user.password = await ctx.helper.bcrypt(user.password);
    // 保存数据
    user = ctx.repo.Manager.create(user);
    return ctx.repo.Manager.save(user);
  }

  // 查询用户
  public async findUser(user) {
    const { ctx } = this;
    const { username, phone, email } = user;
    return ctx.repo.Manager.findOne({
      where: [{ username }, { phone }, { email }], // 数组就是 or 查询
    });
  }
}
