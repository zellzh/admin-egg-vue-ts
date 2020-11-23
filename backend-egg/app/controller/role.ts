/*
 * role --- 角色列表相关操作
 */
import { Controller } from 'egg';
import verifyRole from '../validator/roleInfo';

export default class RoleController extends Controller {
  // 查询
  public async index() {
    const { ctx } = this;
    const queryInfo = Object.keys(ctx.query).length ? ctx.query : '';
    const res = await ctx.service.role.retrieve(queryInfo);
    ctx.sendResult(res, 200, '获取成功');
  }

  // 添加
  public async create() {
    const { ctx } = this;
    const role = ctx.request.body;
    // 1.验证数据
    const { error } = verifyRole.validate(role);
    if (error) throw Object.assign(error, { status: 422 });

    // 2.查询角色是否存在
    const temp = await ctx.service.role.retrieve(role);
    (<any[]>temp).length && ctx.throw('角色已存在', 400);

    // 3.添加角色
    const res = await ctx.service.role.create(role);
    ctx.sendResult(res, 200, '添加成功');
  }

  // 更新
  public async update() {
    const { ctx } = this;
    let { id } = ctx.params;
    id = parseInt(id);
    const role = ctx.request.body;
    // 1.验证数据
    const { error } = verifyRole.validate(role);
    if (error) throw Object.assign(error, { status: 422 });

    // 2.查询角色是否重复
    const temp = await ctx.service.role.retrieve(role);
    const isExist = (<any[]>temp).find(item => item.id !== id);
    isExist && ctx.throw('角色已存在', 400);

    // 3.更新
    const res = await ctx.service.role.update(id, role);
    res.affected ?
      ctx.sendResult(null, 200, '更新成功') :
      ctx.throw('参数不符, 请刷新重试', 400);
  }

  // 删除
  public async destroy() {
    const { ctx } = this;
    let { id } = ctx.params;
    id = parseInt(id);
    const res = await ctx.service.role.delete(id);
    res.affected ?
      ctx.sendResult(null, 200, '删除权限成功') :
      ctx.throw('参数不符, 请刷新重试', 400);
  }
}
