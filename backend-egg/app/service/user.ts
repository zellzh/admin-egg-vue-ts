import { Service } from 'egg';

export default class User extends Service {
  // 保存用户数据
  public async createUser(user) {
    const { ctx } = this
    // 查询用户是否存在
    let found = await this.findUser(user)
    if (found) {
      throw new Error("用户已存在");
    }
    // 密码加密
    let hash = await ctx.helper.bcrypt(user.password)
    user.password = hash
    // 保存数据
    user = ctx.repo.User.create(user)
    return ctx.repo.User.save(user)
  }

  // 查询用户
  public async findUser(user) {
    const { ctx } = this
    const { username, phone, email } = user
    return ctx.repo.User.findOne({ where: [{username}, {phone}, {email}]})
  }
}
