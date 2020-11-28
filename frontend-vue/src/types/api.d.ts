import {AxiosInstance, AxiosResponse} from "axios";

export interface Api {
  all(requests: AxiosInstance | Promise<AxiosInstance>[]): Promise<(AxiosResponse | undefined)[]>
  /* register/login
    ================================ */
  sendEmail(data: object): Promise<AxiosResponse>
  sendSms(data: object): Promise<AxiosResponse>
  isLogin(data?: object): Promise<AxiosResponse>
  inquirer(data: object): Promise<AxiosResponse>
  register(data: object): Promise<AxiosResponse>
  login(data: object): Promise<AxiosResponse>

  /* users
    ================================ */
  getUsers(data?: object): Promise<AxiosResponse>
  addUser(data: object): Promise<AxiosResponse>
  delUser(id: number): Promise<AxiosResponse>
  updateUser(id: number, data: object): Promise<AxiosResponse>
  exportUsers(): Promise<AxiosResponse>
  addUserRole(data: {uid: number, rid: number}): Promise<AxiosResponse>
  delUserRole(uid: number, data: {rid: number}): Promise<AxiosResponse>

  /* rights
    ================================ */
  getRights(type?: string|object, data?: object): Promise<AxiosResponse>
  getParentRights(level: number): Promise<AxiosResponse>
  addRights(data: object): Promise<AxiosResponse>
  delRights(id: number): Promise<AxiosResponse>
  updateRights(id: number, data: object): Promise<AxiosResponse>

  /* role
    ================================ */
  getRoles(data?: object): Promise<AxiosResponse>
  addRole(data: object): Promise<AxiosResponse>
  delRole(id: number): Promise<AxiosResponse>
  updateRole(id: number, data: object): Promise<AxiosResponse>
  addRoleRights(data: {role_id: number, rights_ids: number[]}): Promise<AxiosResponse>
  delRoleRights(role_id: number, data: {rights_ids: number[]}): Promise<AxiosResponse>
}
