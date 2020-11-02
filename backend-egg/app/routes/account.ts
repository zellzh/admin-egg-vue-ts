/*
 * account --- 注册 | 登录等账号相关的路由
 */
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  // 注册
  router.post('/register', controller.manager.register);
  // 登录
  router.post('/login', controller.manager.login);
  // 查询用户是否存在
  router.post('/isExist', controller.manager.isExist);
  // 更新 token
  router.get('/refresh_token', controller.utils.refreshToken);

  // 自定义 oauth 第三方登录
  // router.get('/github', controller.github.loginView);
  // router.get('/passport/github/callback', controller.github.getAccessToken);

  // passport 实现第三方登录
  app.passport.mount('github', {
    session: false,
    successRedirect: null, // 注: 不使用重定向时, 需要置空, 因为默认是 '/', 会重定向
  });
};
