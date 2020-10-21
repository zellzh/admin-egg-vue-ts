import { Controller } from 'egg';

export default class UserController extends Controller {
  public async index() {
    const { ctx } = this;
    try {
      const users = await ctx.service.user.index();
      // console.log(ctx.isAuthenticated()); // 有 session 时可以使用
      ctx.sendResult(users, 200, '获取成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 400, '获取失败');
    }
  }
}
