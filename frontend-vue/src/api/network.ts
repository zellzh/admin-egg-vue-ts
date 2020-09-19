// axios 请求数据
import axios, {AxiosInstance} from 'axios'
import url from "@/api/url";

axios.defaults.baseURL = url.baseUrl
axios.defaults.timeout = 15000
axios.defaults.withCredentials = true // 开启携带 cookie

// 记录请求数
let count = 0

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么

    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么

    return response
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error)
  })

export default {
  async get (url: string, data?: object): Promise<any> {
    try {
      let response = await axios.get(url, { params: data })
      return response.data
    } catch (e) {
      console.error(e)
    }
  },
  async post (url: string, data?: object): Promise<any> {
    try {
      let response = await axios.post(url, data)
      return response.data
    } catch (e) {
      console.error(e)
    }
  },
  all (requests: AxiosInstance[]) {
    return axios.all(requests)
  }
}
