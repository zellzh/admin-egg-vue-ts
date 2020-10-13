import { Service } from 'egg';

export default class Oauth extends Service {
  // 查询授权信息
  public async getOauthUser({ id }) {
    const { ctx } = this;
    return await ctx.repo.Oauth.findOne({
      where: {
        uid: id,
      },
    });
  }

  // 保存用户数据
  public async createOauth(oauth) {
    const { ctx } = this;
    // 保存数据
    oauth = ctx.repo.Oauth.create(oauth);
    return await ctx.repo.Oauth.save(oauth);
  }

  public async test() {
    const { ctx } = this;
    return await ctx.repo.User.find({
      relations: [ 'oauth' ], // 关联查询
    });
  }
}
