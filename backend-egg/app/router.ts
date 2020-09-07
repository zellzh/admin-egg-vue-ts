import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.home.index);

  // 用户信息验证器
  const validator = app.middleware.userinfoValidator()
  // 注册
  router.post('/register', validator,  controller.user.register)
  // 登录
};
