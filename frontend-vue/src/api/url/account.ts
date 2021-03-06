/*
 * 账号注册 | 登录 url 和 api
 */
import actions from "@/api/network";

// 更新 refresh_token
export const refreshTokenUrl = 'refresh_token';

// account url
const url = {
  imgCode: "/imgCode",
  emailCode: "/emailCode",
  smsCode: "/smsCode",
  isExist: '/isExist', // 查询用户
  isLogin: '/isLogin', // 用户是否登录
  register: "/register",
  login: '/login',
  // 第三方
  github: '/passport/github',
}

// account api
export const accountApi = {
  sendEmail: (data: object) => actions.get(url.emailCode, data),
  sendSms: (data: object) => actions.post(url.smsCode, data),
  inquirer: (data: object) => actions.post(url.isExist, data),
  register: (data: object) => actions.post(url.register, data),
  login: (data: object) => actions.post(url.login, data),
  isLogin: (data: object) => actions.get(url.isLogin, data),
  // 注意循环 import 的顺序, account 最先拿到 action, 在其他 api.js 中 action 拿不到
  // all: actions.all
}

export default url
