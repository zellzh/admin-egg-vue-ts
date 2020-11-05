import network from "@/api/network";
import url from "@/api/url";

export default {
  /* register/login
    ================================ */
  sendEmail: (data: object) => network.post(url.emailCode, data),
  sendSms: (data: object) => network.post(url.smsCode, data),
  isLogin: (data: object) => network.get(url.isLogin, data),
  inquirer: (data: object) => network.post(url.isExist, data),
  register: (data: object) => network.post(url.register, data),
  login: (data: object) => network.post(url.login, data),

  /* admin
    ================================ */
  getUsers: (data?: object) => network.get(url.users, data),
  addUser: (data: object) => network.post(url.users, data),
  delUser: (id: number) => network.delete(url.users + `/${id}`),
  updateUser: (data: object) => network.put(url.users, data),
}
