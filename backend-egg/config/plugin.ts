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
};

export default plugin;
