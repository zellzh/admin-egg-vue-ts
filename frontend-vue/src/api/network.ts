// axios 请求数据
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {baseUrl, refreshTokenApi} from './url'
import Vue from "vue";

const vue = Vue.prototype
axios.defaults.baseURL = baseUrl
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true // 开启携带 cookie
// const source = axios.CancelToken.source() // 取消请求

// 记录请求数
let count = 0
// URL 白名单
const whiteUrl = [
  '/isExist'
]

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 所有请求的 headers.Authorization 都携带 access_token
    config.headers.Authorization = localStorage.getItem('act');

    // 更新 token 的请求则携带 refresh_token
    if (config.url?.startsWith(refreshTokenApi)) {
      config.headers.Authorization = localStorage.getItem('rft');
    }
    return config
  },
  error => {
    return Promise.reject(error)
  })

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
   error => {
    if (!error.response) {
      vue.$message.error('可能网络问题, 服务器未响应')
      return
    }
    // 40010 - access_token 过期
    if (error.response.status === 401 && error.response.data.meta.status === 40010) {
      // 更新 access_token
      return updateToken(error.response)
    }

    // 40011 - refresh_token 过期
    if (error.response.status === 401 && error.response.data.meta.status === 40011) {
      vue.$messageBox.confirm(
        '登录已过期, 是否重新登录?',
        {
          title: '提示',
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
      }).then(async () => {
        vue.$message.success('请重新登录')
        // 确定后, 删除 refresh_token, 并刷新页面触发导航守卫跳转
        localStorage.removeItem('rft')
        await vue.$router.push('/login')
      }).catch(() => {
        vue.$message.info('已取消, 继续停留在该页面')
      })

    }
    return Promise.reject(error)
  })

// 刷新 token
async function updateToken(response: AxiosResponse) {
  console.log('更新 token');
  // 请求 refresh 接口, 更新本地 token
  const refreshRes = await GET(refreshTokenApi)
  if (!refreshRes) return
  localStorage.setItem('act', refreshRes.data.access_token)

  // 携带新的 token 重新发起过期之前的请求
  const config = response.config
  config.headers['Authorization'] = refreshRes.data.access_token
  // 返回 response
  return await axios.request(config)
}

// 错误处理
function errHandle(e: AxiosError) {
  if (e.config.url && whiteUrl.includes(e.config.url)) return;
  const errData = e.response?.data
  errData && errData.meta ?
    vue.$message.error(errData.meta.msg) :
    vue.$message.error(errData.message)
}

// 封装的 get 请求
async function GET (url: string, params?: any, opts?: AxiosRequestConfig): Promise<any> {
  try {
    return await axios.get(url, {params: params, ...opts})
  } catch (e) {
    errHandle(e)
  }
}

// 封装的 post 请求
async function POST (url: string, params?: any, opts?: AxiosRequestConfig): Promise<any> {
  try {
    return await axios.post(url, params, opts)
  } catch (e) {
    errHandle(e)
  }
}

// 封装的 delete 请求
async function DEL (url: string, opts?: AxiosRequestConfig): Promise<any> {
  try {
    return await axios.delete(url, opts)
  } catch (e) {
    errHandle(e)
  }
}

// 封装的 put 请求
async function PUT (url: string, params?: any, opts?: AxiosRequestConfig): Promise<any> {
  try {
    return await axios.put(url, params, opts)
  } catch (e) {
    errHandle(e)
  }
}

// 封装的 all 请求
async function ALL (requests: AxiosInstance[]) {
  try {
    return await axios.all(requests)
  } catch (e) {
    errHandle(e)
  }
}

export default {
  get: GET,
  post: POST,
  put: PUT,
  delete: DEL,
  all: ALL
}
