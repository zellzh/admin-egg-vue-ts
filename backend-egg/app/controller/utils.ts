import { Controller } from 'egg';

export default class UtilsController extends Controller {
  // 获取验证码
  public async imgCode() {
    const { ctx } = this
    ctx.body = ctx.helper.imgCode()
  }

  // 发送邮箱验证吗
  public async emailCode() {
    const { ctx } = this
    try {
      let sendInfo = await ctx.helper.emailCode('zellzh@Foxmail.com')
      ctx.sendResult(sendInfo, 200, '发送邮件成功' )
    } catch (e) {
      console.log('emailCode error: ' + e.message);
      ctx.sendResult(null, 400, '发送邮件失败' )
    }
  }

  // 发送短信验证码
  public async smsCode() {
    const { ctx } = this
    try {
      let sendInfo = await ctx.helper.smsCode('18596779967')
      ctx.sendResult(sendInfo, 200, '发送短信成功' )
    } catch (e) {
      console.log('smsCode error: ' + e.message);
      ctx.sendResult(null, 400, '发送短信失败' )
    }
  }
}