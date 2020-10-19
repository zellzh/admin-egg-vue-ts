import 'egg';
import {EggPassport} from "egg-passport";

declare module 'egg' {
  interface Application { // App 接口合并
    passport: EggPassport
  }
}
