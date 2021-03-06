/*
 * users --- admin 用户列表的路由
 */
import { Application } from 'egg';

export = (app: Application) => {
  const { controller, router } = app;
  router.get('/api/v1/users', controller.user.getUser);
  router.post('/api/v1/users', controller.user.addUser);
  router.delete('/api/v1/users/:id', controller.user.delUser);
  router.put('/api/v1/users/:id', controller.user.updateUser);
  router.post('/api/v1/users/avatars', controller.user.uploadUserAvatar);
  router.post('/api/v1/users/excels', controller.user.uploadUserExcel);
  router.get('/api/v1/users/excels', controller.user.exportUserExcel);
};
