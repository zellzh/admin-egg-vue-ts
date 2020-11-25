/*
 * rolesRights --- 角色权限关联相关操作
 */
import { Controller } from 'egg';

export default class RolesRightsController extends Controller {
  // 添加
  public async create() {
    const { ctx } = this;
    const { role_id, rights_ids = [] } = ctx.request.body;
    // 类型验证
    if (typeof role_id !== 'number' || !Array.isArray(rights_ids)) {
      ctx.throw('参数类型错误', 422, {
        details: [ 'role_id 必须是 number', 'rights_ids 必须是数组' ],
      });
    }

    // 开启事务
    const resArr: any[] = [];
    await ctx.ormConnection.transaction(async () => {
      for (const rights_id of rights_ids) {
        // 1.关系存在时, 跳过处理
        const temp = await ctx.service.rolesRights.retrieve(role_id, rights_id);
        if (temp.length) continue;

        // 2.添加用户角色关系
        const res = await ctx.service.rolesRights.create(role_id, rights_id);
        resArr.push(res);
      }
    });
    ctx.sendResult(resArr, 200, '添加成功');
  }

  // 删除
  public async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { rights_ids } = ctx.request.body;
    // 开启事务
    await ctx.ormConnection.transaction(async () => {
      for (const rights_id of rights_ids) {
        await ctx.service.rolesRights.delete(id, rights_id);
      }
    });
    ctx.sendResult(null, 200, '删除分配成功');
  }
}
