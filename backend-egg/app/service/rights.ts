import { Service } from 'egg';
import { Brackets } from 'typeorm';
import Rights from '../entity/Rights';

export default class User extends Service {
  // 条件 | 查询所有
  public async retrieve(param: string|Partial<Rights>) {
    const { ctx } = this;
    // 条件查询
    if (typeof param === 'object') {
      ctx.deleteEmpty(param);
      const { rights_name, rights_type, rights_path, rights_method } = param;
      return ctx.repo.Rights.findOne({
        where: [
          { rights_name, rights_type },
          { rights_path, rights_method },
        ],
      });
    }
    const res = ctx.repo.Rights.find();
    // 树形查询
    if (param === 'tree') {
      return res;
    }
    return res;
  }
  // 查询父级
  public async getParents(level: number) {
    const { ctx } = this;
    return await ctx.repo.Rights.find({ level });
  }
  // 分页查询
  public async searchQuery(searchInfo: any) {
    const { ctx } = this;
    const {
      type, key,
      limit = 5, offset = 1,
    } = searchInfo;
    const [ res, count ] = await ctx.repo.Rights.createQueryBuilder()
      .where(key && new Brackets(qb => {
        qb.where('rights_name LIKE :key', { key: `%${key}%` })
          .orWhere('rights_desc LIKE :key')
          .orWhere('rights_path LIKE :key');
      }))
      .andWhere(type ? 'rights_type = :type' : 'true', { type })
      .skip((offset - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { rights: res, count };
  }

  // 添加
  public async create(rights: Partial<Rights>) {
    const { ctx } = this;
    ctx.deleteEmpty(rights);
    const res = ctx.repo.Rights.create(rights);
    return ctx.repo.Rights.save(res);
  }

  // 删除
  public async delete(id: number) {
    const { ctx } = this;
    return ctx.repo.Rights.delete(id);
  }

  // 更新
  public async update(id: number, updateInfo: Partial<Rights>) {
    const { ctx } = this;
    const {
      rights_name, level, pid, rights_type, rights_state,
      rights_method, rights_path, rights_desc,
    } = updateInfo;
    // 删除空串或者未变更的数据
    delete updateInfo.rights_name;
    rights_desc || delete updateInfo.rights_desc;
    if (rights_type || rights_method || rights_path) {
      const res = await ctx.repo.Rights.findOne({
        where: [
          { rights_name, rights_type },
          { rights_path, rights_method },
        ],
      });
      if (res.id !== id) return '权限类名或路由重复';
    }

    await ctx.repo.Rights.update(id, {
      level,
      pid,
      rights_type,
      rights_method,
      rights_path,
      rights_desc,
      rights_state,
    });
  }
}
