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

  /* admin
    ================================ */
  getUsers(data?: object): AxiosResponse
  addUser(data: object): AxiosResponse
  delUser(id: number): AxiosResponse
  updateUser(id: number, data: object): AxiosResponse
  exportUsers(): AxiosResponse
}
