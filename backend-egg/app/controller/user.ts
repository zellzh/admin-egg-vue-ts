import { Controller } from 'egg';

export default class UserController extends Controller {
  // 注册
  public async register() {
    const { ctx } = this;
    const userinfo = ctx.request.body;

    try {
      // 1.验证码校验
      ctx.helper.verifyCaptcha(userinfo.captcha, userinfo.userType);
      // 2.添加数据库
      await ctx.service.user.createUser(userinfo);
      ctx.sendResult(null, 200, '注册成功');
    } catch (e) {
      console.log('register error: ' + e.message);
      ctx.sendResult(null, 400, '注册失败! ' + e.message);
    }
  }

  // 登录
  public async login() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    try {
      // 1.验证码校验
      ctx.helper.verifyCaptcha(userinfo.captcha, userinfo.userType);
      // 查询用户
      const dbUserinfo = await ctx.service.user.findUser(userinfo);
      if (!dbUserinfo) {
        return ctx.sendResult(null, 400, '用户不存在');
      }
      // 验证密码
      const res = await ctx.helper.compare(userinfo.password, dbUserinfo.password);
      delete dbUserinfo.password;
      delete dbUserinfo.createdAt;
      delete dbUserinfo.updatedAt;
      res ?
        ctx.sendResult(dbUserinfo, 200, '登录成功') : // true 则密码正确
        ctx.sendResult(null, 400, '密码错误'); // false 则密码错误
    } catch (e) {
      console.error('login error: ' + e.message);
      ctx.sendResult(null, 400, e.message);
    }
  }

  // 查询用户
  public async findUser() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    try {
      const res = await ctx.service.user.findUser(userinfo);
      res ?
        ctx.sendResult(res, 200, '已查询到用户') :
        ctx.sendResult(null, 400, '未查询到用户');
    } catch (e) {
      console.error('findUser error: ' + e.message);
      ctx.sendResult(null, 500, '查询失败');
    }
  }
}
