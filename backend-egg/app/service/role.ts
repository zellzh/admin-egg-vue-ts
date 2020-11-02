import { Service } from 'egg';

export default class Role extends Service {
  // 绑定角色
  public async create(uid: number, rid: number) {
    const { ctx } = this;
    const rel = ctx.repo.MgsRoles.create({
      mg_id: uid,
      role_id: rid,
    });
    return ctx.repo.MgsRoles.save(rel);
  }
}
