import { Application } from 'egg';
import captchaRote from './routes/captcha';
import account from './routes/account';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.home.index);
  // 验证登录状态
  router.get('/isLogin', controller.utils.isLogin);

  // 验证码
  captchaRote(app);
  // 注册 | 登录等账号相关
  account(app);

  /* admin: RESTful API
    =========================================== */
  router.get('/api/v1/users', controller.user.getUser);
  router.post('/api/v1/users', controller.user.addUser);
};
