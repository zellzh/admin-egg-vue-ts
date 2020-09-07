import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  
  typeorm: {
    enable: true,
    package: 'egg-ts-typeorm',
  },

  
};

export default plugin;
