/*
 * captcha --- 获取验证码的路由
 */
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/imgCode', controller.utils.imgCode);
  router.post('/emailCode', controller.utils.emailCode);
  router.post('/smsCode', controller.utils.smsCode);
};
