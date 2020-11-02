/*
* 阿里云短信验证码
* API: https://api.aliyun.com/?spm=a2c4g.11186623.2.21.475f50a4czsiON#/?product=Dysmsapi
*/
import Core = require('@alicloud/pop-core');
import { Context } from 'egg';


let transporter: Core;

export default {
  // 创建发送者
  _createTransporter(config: Core.Config): Core {
    return new Core({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      endpoint: config.endpoint || 'https://dysmsapi.aliyuncs.com',
      apiVersion: config.apiVersion || '2017-05-25',
    });
  },
  // 发送短信验证
  async send(ctx: Context, to:string): Promise<unknown> {
    const config = ctx.app.config.sms;
    transporter = transporter || this._createTransporter(config);
    // 1.生成验证码
    const captcha = Math.random().toString().slice(2, 8);
    // 2.发送信息
    const info = {
      RegionId: config.sendInfo.RegionId || 'cn-hangzhou',
      PhoneNumbers: to,
      SignName: config.sendInfo.SignName,
      TemplateCode: config.sendInfo.TemplateCode,
      TemplateParam: config.sendInfo.TemplateParam(captcha),
    };
    const requestOption = {
      method: config.sendInfo.sendMethod || 'POST',
    };
    try {
      // 3.发送成功时, 保存验证码
      const res = await transporter.request('SendSms', info, requestOption);
      ctx.session.smsCode = {
        code: captcha,
        expire: Date.now() + 60 * 1000, // 保存1分钟
      };
      return res;
    } catch (e) {
      throw e;
    }
  },

  // 验证手机
  verify(ctx: Context, clientCode) {
    let code: string,
      expire: number;
    const serverCaptcha = ctx.session.smsCode;
    console.log('sms: ', serverCaptcha);

    try {
      // 取出验证码
      code = serverCaptcha.code;
      expire = serverCaptcha.expire;
    } catch (error) {
      // throw new Error('验证码失效');
      return '验证码失效';
    }

    if (Date.now() >= expire) { // 判断过期
      ctx.session.smsCode = null;
      // throw new Error('验证码已过期');
      return '验证码已过期';
    } else if (clientCode.toLowerCase() !== code) { // 判断错误
      // throw new Error('验证码错误');
      return '验证码错误';
    }
    ctx.session.smsCode = null; // 验证码一次性
  },
};
