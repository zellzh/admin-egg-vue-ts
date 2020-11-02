// axios 请求数据
import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios'
import router from '@/router'
import {refreshTokenApi} from '@/api/url'
import {MessageBox} from 'element-ui'
import Vue from "vue";

const vue = Vue.prototype

axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true // 开启携带 cookie

// 记录请求数
let count = 0

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
  async error => {
    // 40010 - access_token 过期
    if (error.response.status === 401 && error.response.data.meta.status === 40010) {
      // 更新 access_token
      return updateToken(error.response)
    }

    // 40011 - refresh_token 过期
    if (error.response.status === 401 && error.response.data.meta.status === 40011) {
      await MessageBox.confirm(
        '登录已过期, 继续停留在该页面请点击取消',
        {
          title: '提示',
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        })
      // 确定后, 删除 refresh_token, 并刷新页面触发导航守卫跳转
      localStorage.removeItem('rft')
      await router.push('/login')
    }
    return Promise.reject(error)
  })

// 刷新 token
async function updateToken(response: AxiosResponse) {
  console.log('更新 token');
  // 请求 refresh 接口, 更新本地 token
  const refreshRes = await get(refreshTokenApi)
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
    return await axios.get(url, {params: params})
  } catch (e) {
    errHandle(e)
  }
}

// 封装的 post 请求
async function post (url: string, params?: object): Promise<any> {
  try {
    return await axios.post(url, params)
  } catch (e) {
    errHandle(e)
  }
}

// 封装的 all 请求
async function all (requests: AxiosInstance[]) {
  try {
    return await axios.all(requests)
  } catch (e) {
    errHandle(e)
  }
}

// 错误处理
function errHandle(e: AxiosError) {
  const errData = e.response?.data
  errData.meta ?
    vue.$message.error(errData.meta.msg) :
    vue.$message.error(errData.message)
}

export default {
  get,
  post,
  all,
}
