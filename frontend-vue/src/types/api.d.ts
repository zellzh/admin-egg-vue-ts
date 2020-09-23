interface ResponseData {
  data: any
  meta: {
    msg: string
    status: number
  }
}

export interface Api {
  sendEmail(data?: object): Promise<ResponseData>
  sendSms(data?: object): Promise<ResponseData>
  inquirer(data?: object): Promise<ResponseData>
  register(data?: object): Promise<ResponseData>
  login(data?: object): Promise<ResponseData>
}
