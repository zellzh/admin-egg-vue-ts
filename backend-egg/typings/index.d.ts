import 'egg';
import {EggPassport} from "egg-passport";

declare module 'egg' {
  interface Application { // app 接口合并
    passport: EggPassport
  }
  interface Context { // ctx 接口合并

  }
}
