/*
 * 中间件 --- 错误处理
 */

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);

      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message;

      // 处理 err 响应
      if (status === 422) {
        return ctx.sendResult(err.details, status, error);
      }
      ctx.sendResult(null, status, error);
    }
  };
};
