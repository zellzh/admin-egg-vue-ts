import network from "@/api/network";
import url from "@/api/url";

// 返回数据类型
interface ResponseData {
  data: any
  meta: {
    message: string
    code: number
  }
}

export default {
  inquirer: (data?: object): Promise<ResponseData> => network.get(url.inquirer, data),
  register: (data?: object): Promise<ResponseData> => network.post(url.register, data),
}
