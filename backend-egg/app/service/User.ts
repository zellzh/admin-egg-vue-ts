import { Service } from 'egg';

export default class User extends Service {
  // 保存用户数据
  public async createUser(user) {
    const { ctx } = this;
    // 查询用户是否存在
    const found = await this.findUser(user);
    if (found) {
      throw new Error('用户已存在');
    }
    // 密码加密
    user.password = await ctx.helper.bcrypt(user.password);
    try {
      // 保存数据
      user = ctx.repo.User.create(user);
      return await ctx.repo.User.save(user);
    } catch (e) {
      console.error(e);
    }
  }

  // 查询用户
  public async findUser(user) {
    const { ctx } = this;
    const { username, phone, email } = user;
    try {
      return await ctx.repo.User.findOne({
        where: [{ username }, { phone }, { email }], // or 查询
      });
    } catch (e) {
      console.error(e);
    }
  }
}
