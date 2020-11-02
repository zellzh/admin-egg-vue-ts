/*
* joi -- 用户信息校验
 */
import userInfoSchema from '../validator/userInfo';

export default opts => {
  return async (ctx, next) => {
    const body = ctx.request.body;
    const curUrl = ctx.url;
    if (!opts.userUrls.includes(curUrl) || ctx.method !== 'POST') return await next();
    try {
      await userInfoSchema.validateAsync(body, { convert: false }); // 关闭自动转换类型
      await next();
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 400, '用户信息格式有误');
    }
  };
};
