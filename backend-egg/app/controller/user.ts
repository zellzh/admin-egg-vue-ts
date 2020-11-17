/*
 * user --- 用户列表相关操作
 */
import { Controller } from 'egg';
import fs from 'fs';
import path from 'path';

export default class UserController extends Controller {
  // 获取用户
  public async getUser() {
    const { ctx } = this;
    const userInfo = ctx.query;
    try {
      const res = await ctx.service.user.searchQuery(userInfo);
      ctx.sendResult(res, 200, '获取成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 400, '获取失败: 内部错误');
    }
  }

  // 添加用户
  public async addUser() {
    const { ctx } = this;
    const userinfo = ctx.request.body;
    try {
      // 1.查询用户
      const queryInfo = await ctx.service.user.retrieve(userinfo);
      if (typeof queryInfo === 'string') return ctx.sendResult(null, 400, queryInfo);

      // 2.添加数据库
      const user = await ctx.service.manager.create(userinfo);
      // 3.绑定默认角色: 普通用户

      ctx.sendResult(user, 200, '添加成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '添加失败: 内部错误');
    }
  }

  // 删除用户
  public async delUser() {
    const { ctx } = this;
    const { id } = ctx.params;
    try {
      const res = await ctx.service.user.delete(parseInt(id));
      if (res.affected) return ctx.sendResult(null, 200, '删除成功');
      ctx.sendResult(null, 400, '删除失败: 请检查参数!');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '删除失败: 内部错误!');
    }
  }

  // 更新用户
  public async updateUser() {
    const { ctx } = this;
    const { id } = ctx.params;
    const userInfo = ctx.request.body;
    try {
      const updateInfo = await ctx.service.user.update(parseInt(id), userInfo);
      updateInfo ?
        ctx.sendResult(null, 400, updateInfo) :
        ctx.sendResult(null, 200, '更新成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '更新失败: 内部错误!');
    }
  }

  // 接收上传的头像
  public async uploadUserAvatar() {
    const { ctx } = this;
    // 1.获取长传的文件
    const file = ctx.request.files[0];
    // 2.生成唯一文件名
    const fileName = ctx.uuidv4() + path.extname(file.filename);
    // 3.生成文件相对路径, 并组成绝对路径(统一斜杠为 '/')
    const relPath = path.join('/public/avatar', fileName).split(path.sep).join('/');
    const absPath = path.join(this.config.baseDir, 'app', relPath);
    // 4.从缓存读取文件和写入到绝对路径中
    try {
      const buf = fs.readFileSync(file.filepath);
      fs.writeFileSync(absPath, buf);
      // 5.将相对路径返回给前端
      ctx.sendResult({ avatarRelPath: relPath }, 200, '上传头像成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '内部错误: 上传头像失败!');
    }
  }

  // 接收处理上传的用户excel
  public async uploadUserExcel() {
    const { ctx } = this;
    // 注意在上传文件配置中添加文件类型
    const file = ctx.request.files[0];
    const ormRunner = ctx.ormConnection.createQueryRunner();
    try {
      // 1.导入 excel 表格(file / buffer)
      const workSheets = ctx.xlsx.parse(file.filepath); // file

      // 2.将数组结果转成需要的用户对象格式
      const userSheet = workSheets[0].data;
      if (userSheet.length <= 1) return ctx.sendResult(null, 400, 'excel没有数据'); // 空数据返回
      const [ fieldArr, ...dataArr ] = userSheet;
      // 3.开启事务, 保证统一保存
      await ormRunner.startTransaction();
      const users: any[] = [];
      for (const data of dataArr) {
        const user = data.reduce((obj, val, idx) => {
          obj[fieldArr[idx]] = val;
          return obj;
        }, {});
        // 查询数据
        const res = await ctx.service.manager.retrieve(user);
        if (res) { // 数据存在则返回
          await ormRunner.rollbackTransaction();
          return ctx.sendResult(user, 400, '用户重复');
        }
        // 将数据保存到数据库
        const dbUser = await ctx.service.manager.create(user);
        users.push(dbUser);
      }
      await ormRunner.commitTransaction();
      ctx.sendResult(users, 200, '导入用户excel成功!');
    } catch (e) {
      await ormRunner.rollbackTransaction();
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '内部错误: 导入用户失败!');
    }
  }
  // 后端导出 excel
  public async exportUserExcel() {
    const { ctx } = this;
    try {
      // 1.从数据库获取数据
      const users = await ctx.service.user.retrieve();
      if (!Array.isArray(users)) return;
      // 2.将数据处理成 excel 的数组格式
      let data: any = [];
      if (users.length) {
        const fieldArr = Object.keys(users[0]);
        data = users.map(item => {
          return fieldArr.map(key => {
            return item[key];
          });
        });
        data.unshift(fieldArr);
      }
      // 3.将数据保存成buffer, 传给前端
      const buf = ctx.xlsx.build([{ name: 'exportTest', data }]);
      // 设置数据类型
      ctx.response.type = ctx.getMime('.xlsx');
      // 修改文件名称
      ctx.response.attachment('userTest.xlsx');
      // 也可以手动设置响应头
      // ctx.set('Content-Type', ctx.getMime('.xlsx'));
      // ctx.set('Content-disposition', 'attachment; filename=userTest.xlsx');
      ctx.body = buf;
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '内部错误: 导出失败!');
    }
  }
}
