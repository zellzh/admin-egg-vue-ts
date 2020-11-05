import 'egg';
import {EggPassport} from "egg-passport";

declare module 'egg' {
  interface Application { // app 接口合并
    passport: EggPassport
  }
  interface Context { // ctx 接口合并
    sendResult: (data: any, status: number, msg: string, code?: number) => void
    deleteEmpty: (data: object) => void
    uuidv4: () => string
  }
  interface IHelper { // helper 接口合并
    verifyCaptcha: (clientCode: string, type: string) => string | undefined;
  }
}
