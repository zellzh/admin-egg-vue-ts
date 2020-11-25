// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGithub from '../../../app/controller/github';
import ExportHome from '../../../app/controller/home';
import ExportManager from '../../../app/controller/manager';
import ExportMgsRoles from '../../../app/controller/mgsRoles';
import ExportRights from '../../../app/controller/rights';
import ExportRole from '../../../app/controller/role';
import ExportRolesRights from '../../../app/controller/rolesRights';
import ExportUser from '../../../app/controller/user';
import ExportUtils from '../../../app/controller/utils';

declare module 'egg' {
  interface IController {
    github: ExportGithub;
    home: ExportHome;
    manager: ExportManager;
    mgsRoles: ExportMgsRoles;
    rights: ExportRights;
    role: ExportRole;
    rolesRights: ExportRolesRights;
    user: ExportUser;
    utils: ExportUtils;
  }
}
