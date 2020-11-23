import {AxiosResponse} from "axios";

export interface Api {
  /* register/login
    ================================ */
  sendEmail(data: object): AxiosResponse
  sendSms(data: object): AxiosResponse
  isLogin(data?: object): AxiosResponse
  inquirer(data: object): AxiosResponse
  register(data: object): AxiosResponse
  login(data: object): AxiosResponse

  /* users
    ================================ */
  getUsers(data?: object): AxiosResponse
  addUser(data: object): AxiosResponse
  delUser(id: number): AxiosResponse
  updateUser(id: number, data: object): AxiosResponse
  exportUsers(): AxiosResponse

  /* rights
    ================================ */
  getRights(type?: string|object, data?: object): AxiosResponse
  getParentRights(level: number): AxiosResponse
  addRights(data: object): AxiosResponse
  delRights(id: number): AxiosResponse
  updateRights(id: number, data: object): AxiosResponse

  /* role
    ================================ */
  getRoles(data?: object): AxiosResponse
  addRole(data: object): AxiosResponse
  delRole(id: number): AxiosResponse
  updateRole(id: number, data: object): AxiosResponse
  addUserRole(data: {uid: number, rid: number}): AxiosResponse
  delUserRole(uid: number, data: {rid: number}): AxiosResponse
}
