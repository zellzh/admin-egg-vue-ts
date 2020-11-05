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
    try {
      const users = await ctx.service.user.retrieve();
      ctx.sendResult(users, 200, '获取成功');
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
    const userInfo = ctx.params;
    try {
      await ctx.service.user.delete(userInfo);
      ctx.sendResult(null, 200, '删除成功');
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 500, '删除失败: 内部错误!');
    }
  }

  // 更新用户
  public async updateUser() {
    const { ctx } = this;
    const userInfo = ctx.request.body;
    try {
      const updateInfo = await ctx.service.user.update(userInfo);
      updateInfo ?
        ctx.sendResult(null, 400, updateInfo) :
        ctx.sendResult(null, 200, '更新成功');
    } catch (e) {
      ctx.logger.error(e.message);
      ctx.sendResult(null, 500, '更新失败: 内部错误!');
    }
  }

  // 接收上传的头像
  public async uploadAvatar() {
    const { ctx } = this;
    // 1.获取长传的文件
    const file = ctx.request.files[0];
    // 2.生成唯一文件名
    const fileName = ctx.uuidv4() + path.extname(file.filename);
    // 3.生成文件相对路径, 并组成绝对路径
    const relPath = path.join('/public/avatar', fileName);
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
}
