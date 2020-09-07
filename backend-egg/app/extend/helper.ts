import captcha from '../utils/captcha'

// 自定义 ctx.helper 方法
module.exports = {
  // 生成和保存验证码
  imgCode() {
		return captcha.imgCode(this.ctx, this.app)
	},
	// 验证验证码
	verifyImgCode(clientCode) {
    captcha.verifyImgCode(this.ctx, clientCode)
  }
  
}