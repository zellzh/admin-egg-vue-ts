import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,

  // typeorm
  typeorm: {
    enable: true,
    package: 'egg-ts-typeorm',
  },

  // session + redis
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  sessionRedis: {
    enable: true,
    package: 'egg-session-redis',
  },

  // 跨域
  cors: {
    enable: true,
    package: 'egg-cors',
  },

  // 模板引擎 --- ejs
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },

  // egg-passport 第三方登录
  passport: {
    enable: true,
    package: 'egg-passport',
  },
  passportGithub: {
    enable: true,
    package: 'egg-passport-github',
  },
};

export default plugin;
