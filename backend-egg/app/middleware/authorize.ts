/*
* 权限控制: JWT token 鉴权和权限控制
 */

export default (_opts, app) => {
  return async (ctx, next) => {
    const curUrl = ctx.url;
    console.log('-------------------------', curUrl);
    const method = ctx.request.method.toLowerCase();
    // 判断当前 url 是否是白名单
    // const whiteUrls = opts.whiteUrls || [];
    // const isWhiteUrl = whiteUrls.some(whiteUrl => curUrl.startsWith(whiteUrl));
    // 默认对 /api/v1 权限控制
    const isWhiteUrl = !curUrl.startsWith('/api/v1');
    // 非白名单需要鉴权
    if (!isWhiteUrl) {
      // 根据 token 验证是否登录
      const token = ctx.get('authorization');
      try { // 已登录的逻辑
        ctx.jwt.verify(token, app.config.keys);
      } catch (e) { // 未登录的逻辑
        // 判断 access_token 是否过期
        e.name === 'TokenExpiredError' && ctx.throw(401, 'access_token 已过期', { code: 40010 });
        ctx.throw(403, '未登录, 拒绝访问');
      }
      // 已登录: 通过权限列表判断是否有权限
      const allRights = ctx.session.userInfo.rights;
      if (!allRights) ctx.throw(403, '没有访问权限');
      const isPermission = allRights.some(rights => curUrl.startsWith(rights.rights_path) && method === rights.rights_method);
      if (!isPermission) ctx.throw(403, '没有访问权限');
      await next();
    } else {
      // 白名单直接放行
      await next();
    }
  };
};
