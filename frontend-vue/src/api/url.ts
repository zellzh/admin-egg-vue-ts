// domain: 使用 process.env
export const baseUrl = `${process.env.VUE_APP_BASE_API}`;

// register/login 接口
export const account = {
  imgCode: "imgCode",
  emailCode: "emailCode",
  smsCode: "smsCode",
  isExist: 'isExist', // 查询用户
  isLogin: 'isLogin', // 用户是否登录
  register: "register",
  login: 'login',
  // 第三方
  github: 'passport/github',
}
// 更新 refresh_token
export const refreshTokenApi = 'refresh_token';


// admin 接口
export const admin = {
  users: 'api/v1/users',
  avatar: 'api/v1/users/avatars'
}

export default {
  ...account,
  ...admin,
  baseUrl,
  refreshTokenApi,
}
