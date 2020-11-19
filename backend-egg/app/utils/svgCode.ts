/*
* svg-captcha 图形验证码
*/
import { Context, Application } from 'egg';
import svgCaptcha = require('svg-captcha');

export default {
  // 生成和保存验证码
  create(ctx: Context, app: Application) {
    // 生成验证码
    const { data, text } = svgCaptcha.create(app.config.captcha);
    console.log(text);

    // 保存验证码
    ctx.session.imgCode = {
      code: text.toLowerCase(),
      expire: Date.now() + 60 * 1000, // 1分钟过期
    };
    return data;
  },

  // 验证验证码
  verify(ctx: Context, clientCode: string) {
    let code: string,
      expire: number;
    const serverCaptcha = ctx.session.imgCode;
    console.log('svgCode: ', serverCaptcha);

    try {
      // 取出验证码
      code = serverCaptcha.code;
      expire = serverCaptcha.expire;
    } catch (e) {
      ctx.throw('验证码失效', 400);
    }

    if (Date.now() >= expire) { 			// 判断过期
      ctx.session.imgCode = null;
      ctx.throw('验证码已过期', 400);
    } else if (clientCode.toLowerCase() !== code) { // 判断错误
      ctx.session.imgCode = null;
      ctx.throw('验证码错误', 400);
    }
    ctx.session.imgCode = null;				// 验证码有效期只有一次
  },
};
