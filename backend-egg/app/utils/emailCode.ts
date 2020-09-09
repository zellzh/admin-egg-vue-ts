/*
* nodemailer 发送邮箱验证
*/
import nodemailer = require('nodemailer')
import emailModule = require('../schema/emailHtml')
import { Context } from 'egg';

let transporter
export default  {
  // 创建发送者
  _createTransporter(config) {
    return nodemailer.createTransport({
      host: config.host, // 发送邮箱服务器
      port: config.port,
      secure: config.port === 465, // true for 465, false for other ports
      auth: {
        user: config.user, // 发送邮箱
        pass: config.pass, // 发送邮箱的授权码
      },
    });
  },
  // 发送邮件验证
  async send(ctx: Context, to: string): Promise<unknown> {
    const config = ctx.app.config.smtp
    transporter = transporter || this._createTransporter(config)
    // 1.生成验证码
    let captcha = Math.random().toString(16).slice(2, 8)
    // 2.发送信息
    let info = {
      from: '<1365568889@qq.com>', // sender address
      to, // list of receivers
      subject: "Hello ✔", // 邮件标题
      // text: "Hello world?", // 纯文本
      html: emailModule(captcha), // html 模板
    }
    try {
      // 3.发送成功时, 保存验证码
      let res = await transporter.sendMail(info);
      ctx.session.emailCode = {
        code: captcha,
        expire: Date.now() + 60 * 1000 // 保存1分钟
      }
      return res
    } catch (e) {
      throw e
    }
  },

  // 验证邮箱
  verify(ctx: Context, clientCode) {
    let code: string, expire: number,
    serverCaptcha = ctx.session.emailCode
    console.log('email: ', serverCaptcha);
    
    try {
      // 取出验证码
      code = serverCaptcha.code
      expire = serverCaptcha.expire
    } catch (error) {
      throw new Error("验证码无效, 请重新获取")
    }
    
    if (Date.now() >= expire) { // 判断过期
      ctx.session.emailCode = null
      throw new Error('验证码已过期')
    } else if (clientCode.toLowerCase() !== code) { // 判断错误
      throw new Error('验证码错误')
    }
    ctx.session.emailCode = null // 验证码一次性
  }
}