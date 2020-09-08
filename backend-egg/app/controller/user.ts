import { Controller } from 'egg';

export default class UserController extends Controller {
  // 注册
  public async register() {
    const { ctx } = this;
    const userinfo = ctx.request.body
    
    try {
      // 验证码校验
      ctx.helper.verifyCaptcha(userinfo.captcha, userinfo.userType)
      ctx.sendResult(null, 200, '验证成功')
    } catch (e) {
      console.log('verifyCaptcha error: ' + e.message);
      ctx.sendResult(null, 400, e.message)
    }
  }
}
