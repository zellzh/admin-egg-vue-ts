import { Controller } from 'egg';

export default class UsersController extends Controller {
  public async index() {
    const { ctx } = this;
    try {
      const users = await ctx.service.users.index();
      ctx.sendResult(users, 200, '获取成功');
    } catch (e) {
      console.error('controller-users error: ' + e.message);
      ctx.sendResult(null, 400, '获取失败');
    }
  }
}
