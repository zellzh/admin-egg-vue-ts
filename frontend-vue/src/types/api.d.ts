import {AxiosInstance, AxiosResponse} from "axios";

declare module 'axios' {
  interface AxiosResponse {
    data: {
      data: any
      meta: {
        code: number
        msg: string
      }
    }
  }
}

export interface Api {
  all(requests: AxiosInstance | Promise<AxiosInstance>[]): Promise<(AxiosResponse | undefined)[]>
  /* register/login
    ================================ */
  sendEmail(data: object): Promise<AxiosResponse | undefined>
  sendSms(data: object): Promise<AxiosResponse | undefined>
  isLogin(data?: object): Promise<AxiosResponse | undefined>
  inquirer(data: object): Promise<AxiosResponse | undefined>
  register(data: object): Promise<AxiosResponse | undefined>
  login(data: object): Promise<AxiosResponse | undefined>

  /* users
    ================================ */
  getUsers(data?: object): Promise<AxiosResponse | undefined>
  addUser(data: object): Promise<AxiosResponse | undefined>
  delUser(id: number): Promise<AxiosResponse | undefined>
  updateUser(id: number, data: object): Promise<AxiosResponse | undefined>
  exportUsers(): Promise<AxiosResponse | undefined>
  addUserRole(data: {uid: number, rid: number}): Promise<AxiosResponse | undefined>
  delUserRole(uid: number, data: {rid: number}): Promise<AxiosResponse | undefined>

  /* rights
    ================================ */
  getRights(type?: string|object, data?: object): Promise<AxiosResponse | undefined>
  getParentRights(level: number): Promise<AxiosResponse | undefined>
  addRights(data: object): Promise<AxiosResponse | undefined>
  delRights(id: number): Promise<AxiosResponse | undefined>
  updateRights(id: number, data: object): Promise<AxiosResponse | undefined>

  /* role
    ================================ */
  getRoles(data?: object): Promise<AxiosResponse | undefined>
  addRole(data: object): Promise<AxiosResponse | undefined>
  delRole(id: number): Promise<AxiosResponse | undefined>
  updateRole(id: number, data: object): Promise<AxiosResponse | undefined>
  addRoleRights(data: {role_id: number, rights_ids: number[]}): Promise<AxiosResponse | undefined>
  delRoleRights(role_id: number, data: {rights_ids: number[]}): Promise<AxiosResponse | undefined>
}
