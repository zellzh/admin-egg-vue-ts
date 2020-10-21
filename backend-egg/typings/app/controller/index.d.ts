// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGithub from '../../../app/controller/github';
import ExportHome from '../../../app/controller/home';
import ExportManager from '../../../app/controller/manager';
import ExportUser from '../../../app/controller/user';
import ExportUtils from '../../../app/controller/utils';

declare module 'egg' {
  interface IController {
    github: ExportGithub;
    home: ExportHome;
    manager: ExportManager;
    user: ExportUser;
    utils: ExportUtils;
  }
}
