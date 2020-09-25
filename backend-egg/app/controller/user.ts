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
    const { ctx, app } = this;
    const userinfo = ctx.request.body;
    try {
      // 1.验证码校验
      ctx.helper.verifyCaptcha(userinfo.captcha, userinfo.userType);
      // 2.查询用户
      const dbUserinfo = await ctx.service.user.findUser(userinfo);
      if (!dbUserinfo) {
        return ctx.sendResult(null, 400, '用户不存在');
      }
      // 3.验证密码
      const res = await ctx.helper.compare(userinfo.password, dbUserinfo.password);
      // 4.数据处理
      if (res) { // true 则密码正确
        delete dbUserinfo.password;
        delete dbUserinfo.createdAt;
        delete dbUserinfo.updatedAt;
        // ctx.session.user = dbUserinfo; // session 后端保存数据
        // 前端 token 保存数据
        dbUserinfo.token = ctx.jwt.sign(JSON.stringify(dbUserinfo), app.config.keys);
        ctx.sendResult(dbUserinfo, 200, '登录成功');
      } else { // false 则密码错误
        ctx.sendResult(null, 400, '密码错误');
      }
    } catch (e) {
      ctx.sendResult(null, 400, e.message);
    }
  }

  // 查询用户
  public async findUser() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    try {
      const res = await ctx.service.User.findUser(userinfo);
      res ?
        ctx.sendResult(res, 200, '已查询到用户') :
        ctx.sendResult(null, 400, '未查询到用户');
    } catch (e) {
      console.error('findUser error: ' + e.message);
      ctx.sendResult(null, 500, '查询失败');
    }
  }
}
