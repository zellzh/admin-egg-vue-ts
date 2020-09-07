/*
* svg-captcha 相关
*/
import svgCaptcha = require('svg-captcha')
import { Context, Application } from 'egg';

export default {
  // 生成和保存验证码
  imgCode(ctx: Context, app: Application) {
		// 生成验证码
    const {data, text} =  svgCaptcha.create(app.config.captcha)
    console.log(text);
    
    // 保存验证码
    ctx.session.captcha = {
      code: text.toLowerCase(),
      expire: Date.now() + 60 * 1000 // 1分钟过期
    }    
    return data
	},
	// 验证验证码
	verifyImgCode(ctx: Context, clientCode: string) {
    let code: string, expire: number,
    serverCaptcha = ctx.session.captcha
    try {
      // 取出验证码
      code = serverCaptcha.code
      expire = serverCaptcha.expire
    } catch (error) {
      throw new Error("请重新获取验证码")
    }
    
    if (Date.now() >= expire) { 			// 判断过期
      ctx.session.captcha = null
      throw new Error('验证码已过期')
    } else if (clientCode.toLowerCase() !== code) { // 判断错误
      ctx.session.captcha = null
      throw new Error('验证码错误')
    }
    ctx.session.captcha = null				// 验证码有效期只有一次
  }
}
