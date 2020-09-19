interface ResponseData {
  data: any
  meta: {
    msg: string
    status: number
  }
}

export interface Api {
  inquirer(data?: object): Promise<ResponseData>
  register(data?: object): Promise<ResponseData>
}
