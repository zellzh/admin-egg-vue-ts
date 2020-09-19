import mime = require('mime-types');

// 自定义 ctx 方法
module.exports = {
  // 添加统一的返回结果方法
  sendResult(data: unknown, code = 200, message: string) {
    const fmt = this.query.fmt ? this.query.fmt : 'rest';
    if (fmt === 'rest') {
      this.body = {
        data: data || null,
        meta: {
          msg: message,
          status: code,
        },
      };
    }
  },

  // 数据类型查询
  getMime(val: string): string|false {
    return mime.lookup(val);
  },

};
