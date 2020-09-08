import svgCode from '../utils/svgCode'
import emailCode from '../utils/emailCode'
import { SentMessageInfo } from 'nodemailer/lib/smtp-connection'

// 自定义 ctx.helper 方法
module.exports = {
  // 生成和保存图形验证码
  imgCode(): string { 
		return svgCode.create(this.ctx, this.app)
  },
  // 发送邮箱验证码
  async emailCode(to: string): Promise<SentMessageInfo> {
    return await emailCode.send(this.ctx, to)
  },

  // 验证验证码
	verifyCaptcha(clientCode: string, type: string) { 
    const { ctx } = this
    const enum RegisterType { // 注册类型
      Email = 'email',
      Normal = 'normal',
      Phone = 'phone'
    }
    switch (type) {
      case RegisterType.Normal:
        svgCode.verify(ctx, clientCode) // 图形验证码
        break;
      case RegisterType.Email:
        emailCode.verify(ctx, clientCode) // 邮箱验证码
        break;
      default:
        break;
    }
  }
}