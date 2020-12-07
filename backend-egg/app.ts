// 运行时执行的文件
import { Application } from 'egg';

// oauth 登录成功后生成 token, 返回给前端
// token 传递方式: cookie/query/header/window.opener.postMessage/...
async function saveLogin(userInfo, ctx) {
  const app = ctx.app;
  const data = ctx._.pick(userInfo, [ 'id', 'username', 'email', 'phone' ]);
  // access_token
  userInfo.access_token = ctx.jwt.sign(data, app.config.keys, app.config.access_token);

  // refresh_token
  userInfo.refresh_token = ctx.jwt.sign(data, app.config.keys, app.config.refresh_token);
  // 保存登录数据
  ctx.session.userInfo = userInfo;

  // 通过动态页面传递 token(或者使用 cookie / get 参数传递)
  await ctx.render('setOauthToken', {
    userInfo,
    frontendURL: app.config.frontendURL,
  });
}

module.exports = (app: Application) => {
  // passport 验证处理第三方注册/登录
  app.passport.verify(async (ctx, oauth) => {
    // 1.查询 oauth 表的用户 uid 决定登录还是注册
    const existsOauth = await ctx.service.oauth.retrieve(oauth);
    let loginUser;

    // 2.登录/注册第三方用户
    if (existsOauth) {
      // 获取用户数据用于登录
      loginUser = existsOauth.manager;
    } else {
      // 1.生成用户信息并注册到数据库
      const userinfo = {
        username: ctx.uuidv4(), // 随机用户名
        password: 'com.admin', // 初始密码
        github: true,
      };
      loginUser = await ctx.service.manager.create(userinfo);

      // 2.生成授权信息并保存到数据库
      const oauthInfo = {
        access_token: oauth.accessToken, // 字段变更
        uid: oauth.id,
        mg_id: loginUser.id,
        provider: oauth.provider,
      };
      await ctx.service.oauth.create(oauthInfo);
    }
    // 查询当前用户获取权限
    loginUser = await ctx.service.manager.retrieve(loginUser);
    // 3.保存登录
    await saveLogin(loginUser, ctx);
    return loginUser;
  });
};
