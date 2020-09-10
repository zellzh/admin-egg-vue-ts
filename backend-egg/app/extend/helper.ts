import svgCode from '../utils/svgCode'
import emailCode from '../utils/emailCode'
import smsCode from '../utils/smsCode'
import bcrypt from '../utils/bcrypt'

// 自定义 ctx.helper 方法
module.exports = {
  // 生成和保存图形验证码
  imgCode(): string { 
		return svgCode.create(this.ctx, this.app)
  },
  // 发送邮箱验证码
  async emailCode(to: string): Promise<unknown> {
    return emailCode.send(this.ctx, to)
  },
  // 发送手机验证码
  async smsCode(to: string): Promise<unknown> {
    return smsCode.send(this.ctx, to)
  },
  // 验证码校验
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
      case RegisterType.Phone:
        smsCode.verify(ctx, clientCode) // 邮箱验证码
        break;
      default:
        throw new Error("无效的注册类型")
    }
  },

  // 加密
  async bcrypt(password: string): Promise<string> {
    return bcrypt.bcrypt(this.ctx, password)
  },
  // 校验密码
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}