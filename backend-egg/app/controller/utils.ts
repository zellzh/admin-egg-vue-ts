import { Controller } from 'egg';

export default class UtilsController extends Controller {
  // 获取验证码
  public async imgCode() {
    const { ctx } = this
    ctx.body = ctx.helper.imgCode()
  }
}