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
      // convert 开启 trim | 大 | 小写自动验证转换
      await userInfoSchema.validateAsync(body, { convert: true });
      await next();
    } catch (e) {
      ctx.logger.error(e);
      ctx.sendResult(null, 400, '用户信息格式有误');
    }
  };
};
