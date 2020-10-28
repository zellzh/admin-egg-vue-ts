import { Service } from 'egg';

export default class Manager extends Service {
  // 保存用户数据
  public async createUser(user) {
    const { ctx } = this;
    // 密码加密
    user.password = await ctx.helper.bcrypt(user.password);
    // 保存数据
    user = ctx.repo.Manager.create(user);
    return ctx.repo.Manager.save(user);
  }

  // 查询用户
  public async findUser(user) {
    const { ctx } = this;
    const { username, phone, email } = user;
    return ctx.repo.Manager.findOne({
      // 数组就是 or 查询
      where: [{ username }, { phone }, { email }],

      // 快捷的关联查询, 通过 entity.prop 可以多级关联查询
      // relations: [ 'oauth', 'mgsRoles', 'roles', 'roles.rights', 'roles.rolesRights' ],
    });

    // 更多复杂的查询可以使用 builder
    // return ctx.repo.Manager.createQueryBuilder('manager')
    //   .leftJoinAndSelect('manager.mgsRoles', 'mgsRoles')
    //   .leftJoinAndSelect('mgsRoles.role', 'role')
    //   .leftJoinAndSelect('role.rolesRights', 'rolesRights')
    //   .leftJoinAndSelect('rolesRights.rights', 'rights')
    //   .where([{ username }, { phone }, { email }])
    //   .getOne();
  }
}
