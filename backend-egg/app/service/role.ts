import { Service } from 'egg';
import Role from '../entity/Role';

export default class RoleService extends Service {
  // 查询全部
  public async retrieve(query: any) {
    const { ctx } = this;
    // 查询全部
    if (!query) return ctx.repo.Role.find();
    const { offset, limit, role_name } = query;
    // 条件查询
    if (query.hasOwnProperty('role_name')) {
      ctx.deleteEmpty(query);
      return ctx.repo.Role.find({ role_name });
    }
    // 分页查询
    const [ res, count ] = await ctx.repo.Role.createQueryBuilder('role')
      // 根据关系查询到中间表
      .leftJoinAndSelect('role.rolesRights', 'rel')
      // 根据中间表映射权限
      .leftJoinAndMapMany('role.rights', 'rights', 'rights', 'rel.rights_id = rights.id')
      .skip((offset - 1) * limit)
      .take(limit)
      .getManyAndCount();
    // 将拥有权限处理成 tree 并保存
    res.forEach(role => {
      // 默认 id 升序
      const res = role.rights.sort((a, b) => a.id - b.id);
      role.rightsTree = ctx.helper.getRightsTree(res);
    });
    return { role: res, count };
  }
  // 查询指定角色
  public async getRightsById(id: number) {
    const { ctx } = this;
    // 分页查询
    const res = await ctx.repo.Role.createQueryBuilder('role')
      .where({ id })
      // 根据关系查询到中间表
      .leftJoinAndSelect('role.rolesRights', 'rel')
      // 根据中间表映射权限
      .leftJoinAndMapMany('role.rights', 'rights', 'rights', 'rel.rights_id = rights.id')
      .getOne();
    // 默认 id 升序
    const temp = res.rights.sort((a, b) => a.id - b.id);
    res.rightsTree = ctx.helper.getRightsTree(temp);
    return res;
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
