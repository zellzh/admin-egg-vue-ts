import mime = require('mime-types');
import jwt = require('jsonwebtoken');
import { v4 as uuidv4 } from 'uuid';
import xlsx from 'node-xlsx';

// 自定义 ctx 方法
module.exports = {
  // 添加统一的返回结果方法
  sendResult(data: any, status: number, message: string, code: number) {
    this.status = status || 200;
    this.body = {
      data: data || null,
      meta: {
        msg: message,
        code: code || status,
      },
    };
  },
  // 删除空数据, 防止保存空字符串
  deleteEmpty<T>(data: T) {
    Object.keys(data).forEach(key => {
      data[key] === 0 || data[key] || delete data[key];
    });
  },

  // 数据类型查询
  getMime(val: string): string|false {
    return mime.lookup(val);
  },
  // jwt api
  jwt,
  // uuid api
  uuidv4,
  // node-xlsx
  xlsx,
};
