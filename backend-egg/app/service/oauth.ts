import { Service } from 'egg';

export default class Oauth extends Service {
  // 查询授权信息
  public async retrieve({ id }) {
    const { ctx } = this;
    return ctx.repo.Oauth.findOne({
      where: {
        uid: id,
      },
      relations: [ 'manager' ], // 关联字段查询, 只用于简单的左连接查询
    });
  }

  // 保存用户数据
  public async create(oauth) {
    const { ctx } = this;
    // 删除空串
    ctx.deleteEmpty(oauth);
    // 保存数据
    oauth = ctx.repo.Oauth.create(oauth);
    return ctx.repo.Oauth.save(oauth);
  }
}
