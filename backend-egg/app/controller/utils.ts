import { Controller } from 'egg';

export default class UtilsController extends Controller {
  // 获取验证码
  public async imgCode() {
    const { ctx } = this;
    // ctx.response.type = 'image/svg+xml'; // 告诉前端返回的数据类型
    ctx.response.type = ctx.getMime('.svg');
    ctx.body = ctx.helper.imgCode();
  }

  // 发送邮箱验证码
  public async emailCode() {
    const { ctx } = this;
    const { email } = ctx.request.body;
    try {
      const sendInfo = await ctx.helper.emailCode(email);
      ctx.sendResult(sendInfo, 200, '发送邮件成功');
    } catch (e) {
      console.log('emailCode error: ' + e.message);
      ctx.sendResult(null, 400, '发送邮件失败');
    }
  }

  // 发送短信验证码
  public async smsCode() {
    const { ctx } = this;
    const { phone } = ctx.request.body;
    try {
      const sendInfo = await ctx.helper.smsCode(phone);
      ctx.sendResult(sendInfo, 200, '发送短信成功');
    } catch (e) {
      console.log('smsCode error: ' + e.message);
      ctx.sendResult(null, 400, '发送短信失败');
    }
  }

  // 测试登录状态
  public async isLogin() {
    const { ctx, app } = this;
    // const user = ctx.session.user; // session
    const token = ctx.get('authorization');
    try {
      const user = ctx.jwt.verify(token, app.config.keys);
      ctx.sendResult(user, 200, '已经登录');
    } catch (e) {
      console.error('controller-utils-isLogin error: ' + e.message);
      ctx.sendResult(null, 400, '没有登录');
    }
  }

  // 更新 token
  public async refreshToken() {
    const { ctx } = this;
    const token = ctx.get('authorization');
    try {
      const userData = ctx.jwt.verify(token, this.config.keys);
      // 删除过期时间和签发时间
      delete userData.iat;
      delete userData.exp;
      // 更新 access_token
      userData.access_token = ctx.jwt.sign(userData, this.config.keys, this.config.access_token);
      ctx.sendResult(userData, 200, 'access_token 更新成功');
    } catch (e) {
      switch (e.name) {
        case 'TokenExpiredError':
          ctx.status = 401;
          ctx.sendResult(null, 40011, 'refresh_token 已过期, 请重新登录');
          break;
        default:
          ctx.status = 401;
          ctx.sendResult(null, 40000, '无效 token');
          break;
      }
    }
  }
}
