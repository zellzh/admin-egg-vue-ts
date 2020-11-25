import { Service } from 'egg';

export default class RolesRightsService extends Service {
  // 查询
  public async retrieve(role_id: number, rights_id: number) {
    const { ctx } = this;
    return ctx.repo.RolesRights.find({ role_id, rights_id });
  }

  // 添加
  public async create(role_id: number, rights_id: number) {
    const { ctx } = this;
    const rel = ctx.repo.RolesRights.create({ role_id, rights_id });
    return ctx.repo.RolesRights.save(rel);
  }

  // 删除
  public async delete(role_id: number, rights_id: number) {
    const { ctx } = this;
    return ctx.repo.RolesRights.delete({ role_id, rights_id });
  }
}
