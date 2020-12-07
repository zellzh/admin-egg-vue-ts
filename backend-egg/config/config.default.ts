import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import orm from '../ormconfig.json';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

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
  ];
  // 鉴权中间件
  config.authorize = {
    // 鉴权白名单
    whiteUrls: [],
  };
  // 默认权限 id
  config.defaultRids = {
    ordinary: 7,
    manager: 0,
  };

  // jwt 配置
  config.access_token = {
    expiresIn: 120, // number 时间单位是秒
  };
  config.refresh_token = {
    expiresIn: '15d', // string 可提供单位, 无单位是毫秒
  };

  // 密码加密
  config.bcrypt = {
    saltRounds: 10, // 加 salt 的轮数
  };

  // 安全
  config.security = {
    csrf: {
      // 本地关闭 csrf
      ignore: ctx => ctx.ip === '127.0.0.1' || ctx.hostname === 'localhost',
    },
    // 访问白名单: 如果为空, 则对所有请求放行(*), 注意也可用于跨域插件 egg-cors
    // 注意, 前后端 localhost | 127.0.0.1 | 192.168.x.x 必须一致
    domainWhiteList: [
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      '*',
    ],
  };

  // 跨域: 基于 security, 未设置 origin 时, 则使用白名单, 否则覆盖
  config.cors = {
    // origin: '127.0.0.1:8080', // 使用 * 时, 不能携带 cookie
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS',
    credentials: true,
  };

  // 模板引擎
  config.view = {
    // mapping: { '.html': 'ejs' },
    defaultExtension: '.ejs',
    defaultViewEngine: 'ejs', // 只有一个模板引擎时, 可以省略 render 后缀和 mapping
  };

  // 数据库 orm
  config.typeorm = {
    client: orm as MysqlConnectionOptions,
  };
  // redis
  config.redis = {
    client: {
      host: '127.0.0.1',
      port: 6379,
      password: null,
      db: 0,
    },
  };

  // svg-captcha
  config.captcha = {
    size: 4, // 验证码长度
    width: 96, // 验证码图片宽度
    height: 32, // 验证码图片高度
    fontSize: 40, // 验证码文字大小
    ignoreChars: '0oO1ilI', // 验证码字符中排除内容 0o1i
    noise: 3, // 干扰线条的数量
    color: false, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    // background: '#ddd', // 验证码图片背景颜色
  };

  // 邮箱相关配置
  config.smtp = {
    host: 'smtp.qq.com',
    port: 465,
    user: 'xxx', // 发送邮件的邮箱
    pass: 'xxx', // 邮箱对应的授权码
  };
  // 阿里SMS相关配置
  config.sms = {
    accessKeyId: 'xxx',
    accessKeySecret: 'xxx',
    sendInfo: {
      SignName: 'xxx',
      TemplateCode: 'xxx',
      TemplateParam: (captcha: string) => JSON.stringify({ code: captcha }),
    },
  };

  // passport --- 第三方登录
  config.passportGithub = {
    key: 'your_clientID',
    secret: 'your_clientSecret',
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
