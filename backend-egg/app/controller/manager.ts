import { Controller } from 'egg';
import { pick } from 'lodash';

export default class ManagerController extends Controller {
  // 查询用户
  public async isExist() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    const res = await ctx.service.manager.retrieve(userinfo);
    res ?
      ctx.sendResult(res, 200, '已查询到用户') :
      ctx.sendResult(null, 204, '未查询到用户');
  }

  // 注册
  public async register() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    // 1.验证码校验
    ctx.helper.verifyCaptcha(userinfo.captcha, userinfo.userType);

    // 2.查询用户
    const dbUserinfo = await ctx.service.manager.retrieve(userinfo);
    dbUserinfo && ctx.throw('用户已存在', 400, { details: dbUserinfo });

    // 3.添加数据库
    await ctx.service.manager.create(userinfo);
    // 4.绑定默认角色: 管理员

    ctx.sendResult(null, 200, '注册成功');
  }

  // 登录
  public async login() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    // 1.验证码校验
    ctx.helper.verifyCaptcha(userinfo.captcha, userinfo.userType);

    // 2.查询用户
    const dbUserinfo = await ctx.service.manager.retrieve(userinfo);
    dbUserinfo || ctx.throw('用户不存在', 400);

    // 3.验证密码
    const res = await ctx.helper.compare(userinfo.password, dbUserinfo.password);
    // 4.验证后数据保存
    if (res) { // true 则密码正确
      // ctx.session.user = dbUserinfo; // session 后端保存数据

      // 前端 token 保存数据
      this.getToken(pick(dbUserinfo, [ 'id', 'username', 'email', 'phone' ]));
      ctx.sendResult(dbUserinfo, 200, '登录成功');
    } else { // false 则密码错误
      ctx.throw('密码错误', 400, userinfo);
    }
  }
  // 生成登录 token
  private getToken(data) {
    const { ctx } = this;
    // 注: jwt 的 payload 只能是 纯对象(字面量) / JSON / Buffer / 字符串
    // typeorm 返回的是操作后的实体类的实例, 不是对象字面量, 需要转换
    // JSON 不能加第三参数 opts, 只能自己在 JSON 中添加需要的配置(比如: 过期时间)
    // data = JSON.parse(JSON.stringify(data)); // 自动调用实体中的 toJSON
    // dbUserinfo = Object.assign({}, dbUserinfo); // 将实体转为纯对象

    // 注意点: token 保存数据过多时, 前端发送 header 时会超限制导致报错
    data.access_token = ctx.jwt.sign(data, this.config.keys, this.config.access_token);

    // 生成 refresh_token
    data.refresh_token = ctx.jwt.sign(data, this.config.keys, this.config.refresh_token);
    return data;
  }
}
