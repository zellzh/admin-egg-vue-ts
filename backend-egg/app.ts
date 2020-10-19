// 运行时执行的文件
import { Application } from 'egg';

// oauth 登录成功后生成 token, 返回给前端
// token 传递方式: cookie/query/header/window.opener.postMessage/...
async function setToken2Front(user, ctx) {
  const app = ctx.app;
  // access_token
  user = JSON.parse(JSON.stringify(user)); // 自动调用实体中的 toJSON
  const access_token = ctx.jwt.sign(user, app.config.keys, app.config.access_token);

  // refresh_token
  const refresh_token = ctx.jwt.sign(user, app.config.keys, app.config.refresh_token);

  // 通过动态页面传递 token(或者使用 cookie / get 参数传递)
  await ctx.render('setOauthToken', {
    access_token,
    refresh_token,
    frontendURL: app.config.frontendURL,
  });
}

module.exports = (app: Application) => {
  // passport 验证处理注册/登录
  app.passport.verify(async (ctx, oauth) => {
    // 1.查询 oauth 表的用户 uid 决定登录还是注册
    const existsOauth = await ctx.service.oauth.getOauthUser(oauth);
    let loginUser;

    // 2.登录/注册第三方用户
    if (existsOauth) {
      // 获取用户数据用于登录
      loginUser = existsOauth.user;
    } else {
      // 1.生成用户信息并注册到数据库
      const userinfo = {
        username: ctx.uuidv4(), // 随机用户名
        password: 'com.admin', // 初始密码
        github: 1,
      };
      loginUser = await ctx.service.user.createUser(userinfo);

      // 2.生成授权信息并保存到数据库
      const oauthInfo = {
        access_token: oauth.access_token,
        uid: oauth.id,
        user_id: loginUser.id,
        provider: oauth.provider,
      };
      await ctx.service.oauth.createOauth(oauthInfo);
    }
    // 3.将登录 token 传给前端
    await setToken2Front(loginUser, ctx);
    return loginUser;
  });
};
