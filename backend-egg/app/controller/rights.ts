/*
 * rights --- 权限列表相关操作
 */
import { Controller } from 'egg';
import verifyRights from '../validator/rightsInfo';

export default class RightsController extends Controller {
  // 查询
  public async getRights() {
    const { ctx } = this;
    const { view } = ctx.params;
    const queryInfo = ctx.query;
    let res;
    // 分页查询
    if (Object.keys(queryInfo).length && view === 'list') {
      res = await ctx.service.rights.searchQuery(queryInfo);
    } else { // 查询所有
      res = await ctx.service.rights.retrieve(view);
    }
    ctx.sendResult(res, 200, '获取权限成功');
  }
  // 查询父级
  public async getParents() {
    const { ctx } = this;
    const { level } = ctx.params;
    const res = await ctx.service.rights.getParents(level);
    ctx.sendResult(res, 200, '查询成功');
  }

  // 添加
  public async create() {
    const { ctx } = this;
    const rights = ctx.request.body;
    // 1.验证数据
    const { error } = verifyRights.validate(rights);
    if (error) throw Object.assign(error, { status: 422 });

    // 2.查询权限是否重复
    const temp = await ctx.service.rights.retrieve(rights);
    temp.length && ctx.throw('权限类名或路由重复!', 400, { details: temp });

    // 3.添加权限
    const res = await ctx.service.rights.create(rights);
    ctx.sendResult(res, 200, '添加成功');
  }

  // 更新
  public async update() {
    const { ctx } = this;
    let { id } = ctx.params;
    id = parseInt(id);
    const rights = ctx.request.body;
    // 1.验证数据
    const { error } = verifyRights.validate(rights);
    if (error) throw Object.assign(error, { status: 422 });

    // 2.查询权限是否重复
    const res = await ctx.service.rights.retrieve(rights);
    const temp = res.find(item => item.id !== id);
    temp && ctx.throw('权限类名或路由重复!', 400);

    // 3.更新
    const updateResult = await ctx.service.rights.update(id, rights);
    updateResult.affected ?
      ctx.sendResult(null, 200, '更新成功') :
      ctx.throw('参数不符, 请刷新重试', 400);
  }

  // 删除
  public async destroy() {
    const { ctx } = this;
    let { id } = ctx.params;
    id = parseInt(id);
    const res = await ctx.service.rights.delete(id);
    res.affected ?
      ctx.sendResult(null, 200, '删除权限成功') :
      ctx.throw('参数不符, 请刷新重试', 400);
  }
}
