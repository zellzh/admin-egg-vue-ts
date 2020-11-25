/*
 * mgsRoles --- 用户角色关联相关操作
 */
import { Controller } from 'egg';

export default class MgsRolesController extends Controller {
  // 添加
  public async create() {
    const { ctx } = this;
    const { uid, rid } = ctx.request.body;
    if (typeof uid !== 'number' || typeof rid !== 'number') {
      ctx.throw('参数必须是number', 422, { details: [ 'id 必须是 number' ] });
    }

    // 1.查询用户角色关系是否存在
    const temp = await ctx.service.mgsRoles.retrieve(uid, rid);
    temp.length && ctx.throw('角色关系已存在', 400);

    // 2.添加用户角色关系
    const res = await ctx.service.mgsRoles.create(uid, rid);
    ctx.sendResult(res, 200, '添加成功');
  }

  // 删除
  public async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { rid } = ctx.request.body;
    const res = await ctx.service.mgsRoles.delete(id, rid);
    res.affected ?
      ctx.sendResult(null, 200, '删除分配成功') :
      ctx.throw('参数不符, 请刷新重试', 400);
  }
}
