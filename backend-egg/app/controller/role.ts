/*
 * role --- 角色列表相关操作
 */
import { Controller } from 'egg';

export default class RoleController extends Controller {
  // 查询
  public async index() {
    const { ctx } = this;
    const queryInfo = ctx.query;
    try {
      const res = await ctx.service.user.retrieve(queryInfo);
      ctx.sendResult(res, 200, '获取成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 400, '获取失败: 内部错误');
    }
  }

  // 添加
  public async create() {
    const { ctx } = this;
    const info = ctx.request.body;
    // 2.添加数据库
    const role = await ctx.service.manager.create(info);
    console.log(role);
  }

  // 更新
  public async update() {
    const { ctx } = this;
    let { id } = ctx.params;
    id = parseInt(id);
    const role = ctx.request.body;
    const res = await ctx.service.user.update(parseInt(id), role);
    console.log(res);
  }

  // 删除
  public async destroy() {
    const { ctx } = this;
    let { id } = ctx.params;
    id = parseInt(id);
    const res = await ctx.service.user.delete(id);
    console.log(res);
  }
}
