// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportManager from '../../../app/service/manager';
import ExportMgsRoles from '../../../app/service/mgsRoles';
import ExportOauth from '../../../app/service/oauth';
import ExportRights from '../../../app/service/rights';
import ExportRole from '../../../app/service/role';
import ExportRolesRights from '../../../app/service/rolesRights';
import ExportTest from '../../../app/service/test';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    manager: AutoInstanceType<typeof ExportManager>;
    mgsRoles: AutoInstanceType<typeof ExportMgsRoles>;
    oauth: AutoInstanceType<typeof ExportOauth>;
    rights: AutoInstanceType<typeof ExportRights>;
    role: AutoInstanceType<typeof ExportRole>;
    rolesRights: AutoInstanceType<typeof ExportRolesRights>;
    test: AutoInstanceType<typeof ExportTest>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
