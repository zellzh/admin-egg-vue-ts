/*
* nodemailer 发送邮件验证
*/
import nodemailer = require('nodemailer')
import emailModule = require('../utils/emailModule')
import { Context } from 'egg';
import { SentMessageInfo } from 'nodemailer/lib/smtp-connection';

// 创建发送者
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com", // 发送邮箱服务器
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: '1365568889@qq.com', // 发送邮箱
    pass: 'sovysxvkloixjjah', // 发送邮箱的授权码
  },
});

export default {
  // 发送邮件验证
  async send(ctx: Context, to: string): Promise<SentMessageInfo> {
    // 1.生成验证码
    let captcha = Math.random().toString(16).slice(2, 8)
    // 2.保存验证码
    ctx.session.emailCode = {
      code: captcha,
      expire: Date.now() + 60 * 1000 // 保存1分钟
    }
    // 3.发送信息
    let info = {
      from: '<1365568889@qq.com>', // sender address
      to, // list of receivers
      subject: "Hello ✔", // 邮件标题
      // text: "Hello world?", // 纯文本
      html: emailModule(captcha), // html 模板
    }
    return await transporter.sendMail(info);
  },

  // 验证邮箱
  verify(ctx: Context, clientCode) {
    let code: string, expire: number,
    serverCaptcha = ctx.session.emailCode
    console.log(serverCaptcha);
    
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