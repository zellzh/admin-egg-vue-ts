import network from "@/api/network";
import url from "@/api/url";

export default {
  /* register/login
    ================================ */
  sendEmail: (data?: object) => network.post(url.email, data),
  sendSms: (data?: object) => network.post(url.sms, data),
  isLogin: (data?: object) => network.get(url.isLogin, data),
  inquirer: (data?: object) => network.post(url.inquirer, data),
  register: (data?: object) => network.post(url.register, data),
  login: (data?: object) => network.post(url.login, data),

  /* admin
    ================================ */
  users: (data?: object) => network.get(url.users, data),
}
