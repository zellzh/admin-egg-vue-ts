import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1599380392260_4313';
  // 前端接口
  config.frontendURL = 'http://127.0.0.1:8080';

  // 文件上传配置
  config.multipart = {
    mode: 'file',
    fileSize: '10mb',
    fileExtensions: [ // 追加支持的文件
      '.xls',
      '.xlsx',
    ],
  };

  // 注册全局中间件
  config.middleware = [
    'errorHandler', // 先加载
    'authorize',
    'verify',
  ];
  // 鉴权中间件
  config.authorize = {
    // 鉴权白名单
    whiteUrls: [],
  };
  // 数据验证中间件
  config.verify = {
    userUrls: [
      '/register',
      '/api/v1/users',
    ],
  };

  // jwt 配置: number 时间单位是秒; 字符串可提供单位, 无单位是毫秒
  config.access_token = {
    expiresIn: 30, // access_token 有效期
  };
  config.refresh_token = {
    expiresIn: 60, // refresh_token 有效期
  };

  // 密码加密
  config.bcrypt = {
    saltRounds: 10, // 加 salt 的轮数
  };

  // 安全
  config.security = {
    // 访问白名单: 如果为空, 则对所有请求放行(*), 注意也可用于跨域插件 egg-cors
    domainWhiteList: [
      'http://127.0.0.1:8080',
      'http://192.168.1.6:8080',
      'http://localhost:8080', // 注意, 前后端 localhost / 127.0.0.1 / 192.168.x.x 必须一致
      '*',
    ],
  };

  // 跨域: 基于 security, 未设置 origin 时, 则使用白名单, 否则覆盖
  config.cors = {
    // origin: '127.0.0.1:8080', // 使用 * 时, 不能携带 cookie
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };

  // 模板引擎
  config.view = {
    // mapping: { '.html': 'ejs' },
    defaultExtension: '.ejs',
    defaultViewEngine: 'ejs', // 只有一个模板时配置后, 可以省略 render 后缀和 mapping
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };
  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
