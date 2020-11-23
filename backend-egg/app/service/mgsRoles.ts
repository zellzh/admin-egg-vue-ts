import { Service } from 'egg';

export default class MgsRolesService extends Service {
  // 查询
  public async retrieve(mg_id: number, role_id: number) {
    const { ctx } = this;
    return ctx.repo.MgsRoles.find({ mg_id, role_id });
  }

  // 添加
  public async create(mg_id: number, role_id: number) {
    const { ctx } = this;
    const rel = ctx.repo.MgsRoles.create({ mg_id, role_id });
    return ctx.repo.MgsRoles.save(rel);
  }

  // 删除
  public async delete(mg_id: number, role_id: number) {
    const { ctx } = this;
    return ctx.repo.MgsRoles.delete({ mg_id, role_id });
  }
}
