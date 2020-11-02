export const refreshTokenApi = 'refresh_token'; // 更新 refresh_token
export default {
  /* domain: 使用 process.env
    ================================ */
  // baseUrl: process.env.VUE_APP_BASE_API,

  /* register/login
    ================================ */
  imgCode: "imgCode",
  emailCode: "emailCode",
  smsCode: "smsCode",
  isExist: 'isExist', // 查询用户
  isLogin: 'isLogin', // 用户是否登录
  register: "register",
  login: 'login',

  /* Oauth
    ================================ */
  github: 'passport/github',

  /* admin
    ================================ */
  users: 'api/v1/users',
}
