// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuthorize from '../../../app/middleware/authorize';
import ExportErrorHandler from '../../../app/middleware/error_handler';
import ExportVerify from '../../../app/middleware/verify';

declare module 'egg' {
  interface IMiddleware {
    authorize: typeof ExportAuthorize;
    errorHandler: typeof ExportErrorHandler;
    verify: typeof ExportVerify;
  }
}
