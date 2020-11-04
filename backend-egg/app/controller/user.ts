/*
 * user --- 用户列表相关操作
 */
import { Controller } from 'egg';

export default class UserController extends Controller {
  // 获取用户
  public async getUser() {
    const { ctx } = this;
    try {
      const users = await ctx.service.user.retrieve();
      ctx.sendResult(users, 200, '获取成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 400, '获取失败: 内部错误');
    }
  }

  // 添加用户
  public async addUser() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    try {
      // 1.查询用户
      const queryInfo = await ctx.service.user.retrieve(userinfo);
      if (typeof queryInfo === 'string') return ctx.sendResult(null, 400, queryInfo);

      // 2.添加数据库
      const user = await ctx.service.manager.create(userinfo);
      // 3.绑定默认角色: 普通用户

      ctx.sendResult(user, 200, '添加成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '添加失败: 内部错误');
    }
  }

  // 删除用户
  public async delUser() {
    const { ctx } = this;
    const userInfo = ctx.params;
    try {
      await ctx.service.user.delete(userInfo);
      ctx.sendResult(null, 200, '删除成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '删除失败: 内部错误!');
    }
  }
}
