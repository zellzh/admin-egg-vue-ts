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
  router.post('/inquirer', controller.user.findUser);
  // 验证登录状态
  router.get('/islogin', controller.utils.isLogin);

  // 用户信息验证器
  const validator = app.middleware.userinfoValidator();
  // 注册
  router.post('/register', validator, controller.user.register);
  // 登录
  router.post('/login', controller.user.login);

  /* admin
    =========================================== */
  router.get('/users', controller.users.index);
};