// axios 请求数据
import axios, {AxiosInstance, AxiosResponse} from 'axios'
import Vue from "vue";
import router from '@/router'

axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true // 开启携带 cookie

// 记录请求数
let count = 0

// 添加请求拦截器
axios.interceptors.request.use(
  config => { // 在发送请求之前做些什么
    // 所有请求的 headers.Authorization 都携带 access_token
    config.headers.Authorization = localStorage.getItem('act');

    // 更新 token 的请求则携带 refresh_token
    if (config.url?.startsWith('refreshtoken')) {
      config.headers.Authorization = localStorage.getItem('rft');
    }
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
    // 40010 - access_token 过期
    if (error.response.status === 401 && error.response.data.meta.status === 40010) {
      // 更新 access_token
      return updateToken(error.response)
    }

    // 40011 - refresh_token 过期
    if (error.response.status === 401 && error.response.data.meta.status === 40011) {
      // 更新 access_token
      localStorage.removeItem('rft')
      location.reload() // 刷新页面触发导航守卫跳转
      Vue.prototype.$message.error('登录过期, 请重新登录')
    }
    return Promise.reject(error)
  })

// 刷新 token
async function updateToken(response: AxiosResponse) {
  console.log('更新 token');
  // 请求 refresh 接口, 更新本地 token
  const refreshRes = await get('refreshtoken')
  if (!refreshRes) return
  localStorage.setItem('act', refreshRes.data.access_token)

  // 携带新的 token 重新发起过期之前的请求
  const config = response.config
  config.headers['Authorization'] = refreshRes.data.access_token
  // 返回 response
  return await axios.request(config)
}

// 封装的 get 请求
async function get (url: string, params?: object): Promise<any> {
  try {
    const response = await axios.get(url, { params: params })
    return response?.data
  } catch (e) {
    console.error(e)
  }
}

// 封装的 post 请求
async function post (url: string, params?: object): Promise<any> {
  try {
    let response = await axios.post(url, params)
    return response?.data
  } catch (e) {
    console.error(e)
  }
}

// 封装的 all 请求
function all (requests: AxiosInstance[]) {
  return axios.all(requests)
}

export default {
  get,
  post,
  all,
}
