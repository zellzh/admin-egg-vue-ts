import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.home.index);
  /* login/register
    =========================================== */
  // 获取验证码
  router.get('/captcha', controller.utils.imgCode);
  router.post('/email', controller.utils.emailCode);
  router.post('/sms', controller.utils.smsCode);
  // 查询用户是否存在
  router.post('/inquirer', controller.manager.findUser);
  // 验证登录状态
  router.get('/islogin', controller.utils.isLogin);
  // 更新 token
  router.get('/refreshtoken', controller.utils.refreshToken);

  // 用户信息验证器
  const validator = app.middleware.userinfoValidator();
  // 注册
  router.post('/register', validator, controller.manager.register);
  // 登录
  router.post('/login', controller.manager.login);
  // oauth 第三方
  // router.get('/github', controller.github.loginView);
  // router.get('/passport/github/callback', controller.github.getAccessToken);
  app.passport.mount('github', {
    session: false,
    successRedirect: null, // 注: 不使用重定向时, 需要置空, 因为默认是 '/', 会重定向
  }); // 使用 passport

  /* admin
    =========================================== */
  router.get('/users', controller.user.index);

};
