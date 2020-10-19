/*
* JWT --- 鉴权和登录 access_token
 */
export default (opts, app) => {
  return async (ctx, next) => {
    if (opts.authUrls.includes(ctx.url)) { // 需要鉴权
      const token = ctx.get('authorization');
      try {
        ctx.jwt.verify(token, app.config.keys);
        await next();
      } catch (e) {
        console.error(e.message);
        switch (e.name) {
          case 'TokenExpiredError':
            ctx.status = 401;
            ctx.sendResult(null, 40010, 'access_token 已过期');
            break;
          default:
            ctx.status = 401;
            ctx.sendResult(null, 40000, '无效 token');
            break;
        }
      }
    } else {
      await next();
    }
  };
};
