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

  // 删除
  public async delRights() {
    const { ctx } = this;
    const { id } = ctx.params;
    try {
      const res = await ctx.service.rights.delete(parseInt(id));
      if (res.affected) return ctx.sendResult(null, 200, '删除权限成功');
      ctx.sendResult(null, 400, '删除失败: 请检查参数!');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '删除失败: 内部错误!');
    }
  }

  // 更新
  public async updateRights() {
    const { ctx } = this;
    const { id } = ctx.params;
    const rights = ctx.request.body;
    try {
      const updateInfo = await ctx.service.rights.update(parseInt(id), rights);
      updateInfo ?
        ctx.sendResult(null, 400, updateInfo) :
        ctx.sendResult(null, 200, '更新成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '更新失败: 内部错误!');
    }
  }
}
