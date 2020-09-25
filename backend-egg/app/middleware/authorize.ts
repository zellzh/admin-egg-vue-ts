/*
* JWT --- 鉴权和登录 token
 */
export default (opts, app) => {
  return async (ctx, next) => {
    if (opts.authUrls.includes(ctx.url)) { // 需要鉴权
      const token = ctx.get('authorization');
      try {
        ctx.jwt.verify(token, app.config.keys);
        await next();
      } catch (e) {
        console.error(e);
        ctx.sendResult(null, 400, '没有访问权限');
      }
    } else {
      next();
    }
  };
};
