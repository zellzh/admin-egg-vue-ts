import { Controller } from 'egg';

export default class ManagerController extends Controller {
  // 查询用户
  public async isExist() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    try {
      const res = await ctx.service.manager.retrieve(userinfo);
      res ?
        ctx.sendResult(res, 200, '已查询到用户') :
        ctx.sendResult(null, 200, '未查询到用户', 400);
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '内部错误, 查询失败');
    }
  }

  // 注册
  public async register() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    try {
      // 1.验证码校验
      const invalid = ctx.helper.verifyCaptcha(userinfo.captcha, userinfo.userType);
      if (invalid) return ctx.sendResult(null, 400, invalid);

      // 2.查询用户
      const dbUserinfo = await ctx.service.manager.retrieve(userinfo);
      if (dbUserinfo) return ctx.sendResult(null, 400, '用户已存在');

      // 3.添加数据库
      await ctx.service.manager.create(userinfo);
      // 4.绑定默认角色: 管理员

      ctx.sendResult(null, 200, '注册成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '内部错误, 注册失败!');
    }
  }

  // 登录
  public async login() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    try {
      // 1.验证码校验
      const invalid = ctx.helper.verifyCaptcha(userinfo.captcha, userinfo.userType);
      if (invalid) return ctx.sendResult(null, 400, invalid);

      // 2.查询用户
      let dbUserinfo = await ctx.service.manager.retrieve(userinfo);
      if (!dbUserinfo) {
        return ctx.sendResult(null, 400, '用户不存在');
      }
      // 3.验证密码
      const res = await ctx.helper.compare(userinfo.password, dbUserinfo.password);
      // 4.数据处理
      if (res) { // true 则密码正确
        // ctx.session.user = dbUserinfo; // session 后端保存数据

        // 前端 token 保存数据
        dbUserinfo = this.getToken(dbUserinfo);
        ctx.sendResult(dbUserinfo, 200, '登录成功');
      } else { // false 则密码错误
        ctx.sendResult(null, 400, '密码错误');
      }
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '内部错误, 登录失败!');
    }
  }
  // 生成登录 token
  private getToken(data) {
    const { ctx } = this;
    // 注: jwt 的 payload 只能是 纯对象(字面量) / JSON / Buffer / 字符串
    // typeorm 返回的是操作后的实体类的实例, 不是对象字面量, 需要转换
    // JSON 不能加第三参数 opts, 只能自己在 JSON 中添加需要的配置(比如: 过期时间)
    data = JSON.parse(JSON.stringify(data)); // 自动调用实体中的 toJSON
    // dbUserinfo = Object.assign({}, dbUserinfo); // 将实体转为纯对象
    data.access_token = ctx.jwt.sign(data, this.config.keys, this.config.access_token);

    // 生成 refresh_token
    data.refresh_token = ctx.jwt.sign(data, this.config.keys, this.config.refresh_token);
    return data;
  }
}
