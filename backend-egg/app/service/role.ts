import { Service } from 'egg';
import Role from '../entity/Role';

export default class RoleService extends Service {
  // 查询
  public async retrieve(query: any) {
    const { ctx } = this;
    if (!query) return ctx.repo.Role.find();
    const { offset, limit, role_name } = query;
    if (query.hasOwnProperty('role_name')) {
      ctx.deleteEmpty(query);
      return ctx.repo.Role.find({ role_name });
    }
    const [ res, count ] = await ctx.repo.Role.findAndCount({
      skip: (offset - 1) * limit,
      take: limit,
    });
    return { role: res, count };
  }

  // 添加
  public async create(role: Partial<Role>) {
    const { ctx } = this;
    role = ctx.repo.Role.create(role);
    return ctx.repo.Role.save(role);
  }

  // 更新
  public async update(id: number, role: Partial<Role>) {
    const { ctx } = this;
    const { role_name, role_desc, role_state = true } = role;
    return ctx.repo.Role.update(id, {
      role_name, role_desc, role_state,
    });
  }

  // 删除
  public async delete(id: number) {
    const { ctx } = this;
    return ctx.repo.Role.delete(id);
  }
}
