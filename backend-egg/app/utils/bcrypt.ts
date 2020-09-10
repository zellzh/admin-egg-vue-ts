/*
* bcrypt 密码加密
*/
const bcrypt = require('bcrypt')
const { promisify } = require('util')
import { Context } from 'egg'

// 将回调函数变为 promise
const hash = promisify(bcrypt.hash)
const compare = promisify(bcrypt.compare)

export default {
  // 加密
  async bcrypt(ctx: Context, password: string): Promise<string> {
    const saltRounds = ctx.app.config.bcrypt.saltRounds
    return hash(password, saltRounds)
  },

  // 校验: true 为验证成功, false 就是失败
  async compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash)
  }
}