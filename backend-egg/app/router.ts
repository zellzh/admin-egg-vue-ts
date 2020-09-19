import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.home.index);
  // 获取验证码
  router.get('/captcha', controller.utils.imgCode);
  router.get('/email', controller.utils.emailCode);
  router.get('/sms', controller.utils.smsCode);
  // 查询用户是否存在
  router.get('/inquirer', controller.user.findUser);

  // 用户信息验证器
  const validator = app.middleware.userinfoValidator();
  // 注册
  router.post('/register', validator, controller.user.register);
  // 登录
  router.post('/login', validator, controller.user.login);
};
