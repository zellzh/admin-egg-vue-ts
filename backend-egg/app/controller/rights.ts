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
    try {
      let res;
      // 分页查询
      if (Object.keys(queryInfo).length && view === 'list') {
        res = await ctx.service.rights.searchQuery(queryInfo);
      } else { // 查询所有
        res = await ctx.service.rights.retrieve(view);
      }
      ctx.sendResult(res, 200, '获取权限成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '获取失败: 内部错误!');
    }
  }
  // 查询父级
  public async getParents() {
    const { ctx } = this;
    const { level } = ctx.params;
    try {
      const res = await ctx.service.rights.getParents(level);
      ctx.sendResult(res, 200, '查询成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '查询失败: 内部错误!');
    }
  }

  // 添加
  public async addRights() {
    const { ctx } = this;
    const rights = ctx.request.body;
    try {
      // 1.验证数据
      const { error } = verifyRights.validate(rights);
      if (error) {
        ctx.logger.warn(error.message);
        return ctx.sendResult(null, 400, '添加失败: 提交的数据格式不符!');
      }
      // 2.查询权限是否重复
      const temp = await ctx.service.rights.retrieve(rights);
      if (temp) return ctx.sendResult(temp, 400, '添加失败: 权限类名或路由重复!');
      // 3.添加权限
      const res = await ctx.service.rights.create(rights);
      ctx.sendResult(res, 200, '添加成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '添加失败: 内部错误!');
    }
  }
}
