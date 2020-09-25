import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1599380392260_4313';

  // add your egg config in here
  config.middleware = [ // 注册全局中间件
    'authorize',
  ];
  config.authorize = {
    authUrls: [ // 鉴权路由
      '/users',
    ],
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // 密码加密
  config.bcrypt = {
    saltRounds: 10, // 加 salt 的轮数
  };

  // 安全
  config.security = {
    domainWhiteList: [ // 跨域(访问)白名单: 如果为空, 则对所有请求放行
      'http://127.0.0.1:8080',
      'http://192.168.1.6:8080',
      'http://localhost:8080', // 注意, 前后端 localhost / 127.0.0.1 / 192.168.x.x 必须一致
    ],
  };

  // 跨域: 基于 security, 未设置 origin 时, 则使用白名单, 否则覆盖
  config.cors = {
    // origin: '*', // 使用 * 时, 不能携带 cookie
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};