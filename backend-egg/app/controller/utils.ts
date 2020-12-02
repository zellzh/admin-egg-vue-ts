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
    const sendInfo = await ctx.helper.emailCode(email);
    ctx.sendResult(sendInfo, 200, '发送邮件成功');
  }

  // 发送短信验证码
  public async smsCode() {
    const { ctx } = this;
    const { phone } = ctx.request.body;
    const sendInfo = await ctx.helper.smsCode(phone);
    ctx.sendResult(sendInfo, 200, '发送短信成功');
  }

  // 更新 access_token --- refresh_token
  public async refreshToken() {
    const { ctx } = this;
    // 根据 refresh_token 来刷新 access_token
    const token = ctx.get('authorization');
    try {
      const data = ctx.jwt.verify(token, this.config.keys);
      // 删除时间, 提取用户数据
      delete data.iat;
      delete data.exp;
      // 重新生成 access_token
      const access_token = ctx.jwt.sign(data, this.config.keys, this.config.access_token);
      ctx.sendResult({ access_token }, 200, 'access_token 更新成功');
    } catch (e) {
      ctx.throw(401, '登录过期, 请重新登录', { code: 40011 });
    }
  }

  // 测试登录状态
  public async isLogin() {
    const { ctx, app } = this;
    // const user = ctx.session.user; // session
    const token = ctx.get('authorization');
    const user = ctx.jwt.verify(token, app.config.keys);
    ctx.sendResult(user, 200, '已经登录');
  }
}
