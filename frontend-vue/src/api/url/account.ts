import actions from "@/api/network";

// 更新 refresh_token
export const refreshTokenApi = 'refresh_token';

// register/login 接口
const url = {
  imgCode: "imgCode",
  emailCode: "emailCode",
  smsCode: "smsCode",
  isExist: 'isExist', // 查询用户
  isLogin: 'isLogin', // 用户是否登录
  register: "register",
  login: 'login',
  // 第三方
  github: '/passport/github',
}

// register/login 请求方法
export const accountAction = {
  sendEmail: (data: object) => actions.get(url.emailCode, data),
  sendSms: (data: object) => actions.post(url.smsCode, data),
  inquirer: (data: object) => actions.post(url.isExist, data),
  register: (data: object) => actions.post(url.register, data),
  login: (data: object) => actions.post(url.login, data),
  isLogin: (data: object) => actions.get(url.isLogin, data),
}

export default url
