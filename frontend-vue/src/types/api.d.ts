interface ResponseData {
  data: any
  meta: {
    msg: string
    status: number
  }
}

export interface Api {
  /* register/login
    ================================ */
  sendEmail(data?: object): Promise<ResponseData>
  sendSms(data?: object): Promise<ResponseData>
  isLogin(data?: object): Promise<ResponseData>
  inquirer(data?: object): Promise<ResponseData>
  register(data?: object): Promise<ResponseData>
  login(data?: object): Promise<ResponseData>

  /* admin
    ================================ */
  users(data?: object): Promise<ResponseData>
}
