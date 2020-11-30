import { Service } from 'egg';
import Manager from '../entity/Manager';

export default class ManagerService extends Service {
  // 保存用户数据
  public async create(user: Partial<Manager>) {
    const { ctx } = this;
    // 删除空串, 防止不必要的bug
    ctx.deleteEmpty(user);
    // 密码加密
    user.password = await ctx.helper.bcrypt(user.password);
    // 保存数据
    user = ctx.repo.Manager.create(user);
    return ctx.repo.Manager.save(user);
  }

  // 查询用户
  public async retrieve(user: Partial<Manager>) {
    const { ctx } = this;
    const { username, phone, email } = user;
    const res = await ctx.repo.Manager.createQueryBuilder('user')
      // 通过两张中间表查询到当前用户所有权限
      .leftJoinAndSelect('mgs_roles', 'userRel', 'user.id = userRel.mg_id')
      .leftJoinAndSelect('roles_rights', 'roleRel', 'userRel.role_id = roleRel.role_id')
      .leftJoinAndMapMany('user.rights', 'rights', 'rights', 'rights.id = roleRel.rights_id')
      .where([{ username }, { phone }, { email }])
      .getOne();
    // 默认 id 升序
    if (res) {
      const temp = res.rights.sort((a, b) => a.id - b.id);
      res.rightsTree = ctx.helper.getRightsTree(temp);
    }
    return res;
  }
}
