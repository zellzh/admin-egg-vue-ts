// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuthorize from '../../../app/middleware/authorize';
import ExportUserinfoValidator from '../../../app/middleware/userinfo-validator';

declare module 'egg' {
  interface IMiddleware {
    authorize: typeof ExportAuthorize;
    userinfoValidator: typeof ExportUserinfoValidator;
  }
}
