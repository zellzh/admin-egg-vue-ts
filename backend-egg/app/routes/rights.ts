/*
 * users --- rights 权限列表的路由
 */
import { Application } from 'egg';

export = (app: Application) => {
  const { controller, router } = app;
  router.get('/api/v1/rights/parents/:level', controller.rights.getParents);
  router.get('/api/v1/rights/:view', controller.rights.getRights);
  // router.post('/api/v1/rights', controller.rights.create);
  // router.delete('/api/v1/rights/:id', controller.rights.destroy);
  // router.put('/api/v1/rights/:id', controller.rights.update);
};
