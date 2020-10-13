import { Service } from 'egg';

export default class User extends Service {
  // 保存用户数据
  public async createUser(user) {
    const { ctx } = this;
    // 密码加密
    user.password = await ctx.helper.bcrypt(user.password);
    // 保存数据
    user = ctx.repo.User.create(user);
    return await ctx.repo.User.save(user);
  }

  // 查询用户
  public async findUser(user) {
    const { ctx } = this;
    const { username, phone, email } = user;
    return await ctx.repo.User.findOne({
      where: [{ username }, { phone }, { email }], // 数组就是 or 查询
    });
  }
}
