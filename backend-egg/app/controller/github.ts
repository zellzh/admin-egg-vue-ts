import { Controller } from 'egg';
import querystring from 'querystring';

export default class OauthController extends Controller {
  // 获取 github 的登录界面
  public async loginView() {
    const { ctx } = this;
    // 1.请求第三方登录界面的 URL
    const gitLoginURL = 'https://github.com/login/oauth/authorize'; // 授权登录界面
    // 2.请求第三方登录的授权信息
    const oauthParams = { // GET 授权参数
      client_id: '47ca316d367b13870043', // 必填
      scope: 'user', // 可选
    };
    const url = `${gitLoginURL}?${querystring.stringify(oauthParams)}`;
    // 3.重定向到第三方登录界面: 注意可能会被配置中的 security 白名单影响
    ctx.redirect(url); // 重定向只有 get
  }

  // 获取 token
  public async getAccessToken() {
    const { ctx } = this;
    // 1.拿到登录后返回的临时授权码 code
    const { code } = ctx.query;
    // 2.携带 code 请求获取 access_token
    const baseURL = 'https://github.com/login/oauth/access_token';
    const oauthParams = {
      client_id: '47ca316d367b13870043', // 必填
      client_secret: 'd68be2df22dad0aa70f7af4cfd2f9df5151caaf4', // 必填
      code, // 必填
    };
    // 3.请求授权 url 获取 access_token
    const res = await ctx.curl(baseURL, {
      method: 'POST',
      data: oauthParams,
      dataType: 'json',
    });
    // 4.使用获取到的 access_token 去获取用户资源
    await this.getUserSource(res.data.access_token);
  }

  // 获取用户信息
  private async getUserSource(token) {
    const { ctx } = this;
    // 1.使用 access_token 访问资源服务器
    const baseURL = 'https://api.github.com/user';
    const res = await ctx.curl(baseURL, {
      method: 'GET',
      headers: { // 使用 headers.Authorization 携带 token, 也可以使用 get 参数携带 access_token
        Authorization: `token ${token}`,
      },
      dataType: 'json',
    });
    const data = res.data;
    data.provider = 'github';
    await this.go2Login(data, token);
  }

  // 登录(注册)并跳转到登录后的界面
  private async go2Login(data, token) {
    const { ctx } = this;
    // 1.查询 oauth 表的用户 uid 决定登录还是注册
    const user = await ctx.service.oauth.getOauthUser(data);

    // 2.注册后登录
    if (!user) {
      // 1.生成用户信息并保存到数据库
      const userInfo = {
        username: ctx.uuidv4(), // 随机用户名
        password: 'com.admin', // 初始密码
        github: 1,
      };
      const user = await ctx.service.user.createUser(userInfo);
      console.log(user);
      // 2.生成授权信息并保存到数据库
      const oauthInfo = {
        access_token: token,
        uid: data.id,
        user_id: user.id,
      };
      await ctx.service.oauth.createOauth(oauthInfo);
    }

    // 3.直接登录(跳转到admin界面)
    // const token = ctx.jwt.sign(JSON.stringify(user), this.config.keys);
    // ctx.cookies.set('token', token, {
    //   path: '/',
    //   maxAge: 24 * 60 * 60 * 1000,
    //   // 注意点: 如果httpOnly: true, 那么前端是无法获取这个cookie
    //   httpOnly: false,
    // });
    // ctx.redirect('http://127.0.0.1:8080/admin');
  }
}
