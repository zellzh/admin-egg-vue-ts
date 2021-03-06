import { Controller } from 'egg';
import verifyRole from '../validator/userInfo';

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
    // 0.验证数据
    const { error } = verifyRole.validate(userinfo);
    error && ctx.throw(422, '角色信息参数不符', { details: error.details });

    // 1.验证码校验
    ctx.helper.verifyCaptcha(userinfo.captcha, userinfo.userType);

    // 2.查询用户
    let dbUserinfo = await ctx.service.manager.retrieve(userinfo);
    dbUserinfo && ctx.throw(400, '用户已存在');

    // 3.添加数据库
    dbUserinfo = await ctx.service.manager.create(userinfo);
    // 4.绑定默认角色: 管理员
    await ctx.service.mgsRoles.create(dbUserinfo.id, this.config.defaultRids.manager);

    ctx.sendResult(null, 200, '注册成功');
  }

  // 登录
  public async login() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    // 1.验证码校验
    ctx.helper.verifyCaptcha(userinfo.captcha, userinfo.userType);

    // 2.查询用户
    let dbUserinfo = await ctx.service.manager.retrieve(userinfo);
    dbUserinfo || ctx.throw(400, '用户不存在');

    // 3.验证密码
    const res = await ctx.helper.compare(userinfo.password, dbUserinfo.password);
    // 4.验证后数据保存
    if (res) { // true 则密码正确
      // ctx.session.user = dbUserinfo; // session 后端保存数据

      // 保存登录数据
      dbUserinfo = this.saveLoginInfo(dbUserinfo);
      ctx.sendResult(dbUserinfo, 200, '登录成功');
    } else { // false 则密码错误
      ctx.throw(400, '密码错误');
    }
  }
  // 生成登录 token
  public saveLoginInfo(userInfo: any) {
    const { ctx } = this;
    const tokenData = ctx._.pick(userInfo, [ 'id', 'username', 'email', 'phone' ]);
    // 注: jwt 的 payload 只能是 纯对象(字面量) / JSON / Buffer / 字符串
    // typeorm 返回的是操作后的实体类的实例, 不是对象字面量, 需要转换
    // JSON 不能加第三参数 opts, 只能自己在 JSON 中添加需要的配置(比如: 过期时间)
    // data = JSON.parse(JSON.stringify(data)); // 自动调用实体中的 toJSON
    // dbUserinfo = Object.assign({}, dbUserinfo); // 将实体转为纯对象

    // 注意点: token 保存数据过多时, 前端发送 header 时会超限制导致报错
    userInfo.access_token = ctx.jwt.sign(tokenData, this.config.keys, this.config.access_token);

    // 生成 refresh_token
    userInfo.refresh_token = ctx.jwt.sign(tokenData, this.config.keys, this.config.refresh_token);

    // 保存用户数据到 session
    ctx.session.userInfo = userInfo;
    return userInfo;
  }
}
