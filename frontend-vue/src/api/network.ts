// axios 请求数据
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {baseUrl, refreshTokenUrl} from './url'
import Vue from "vue";

const vue = Vue.prototype
axios.defaults.baseURL = baseUrl
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true // 开启携带 cookie
const source = axios.CancelToken.source() // 取消请求

// 请求白名单
const actionWhite: any[] = [
  '/isExist',
  '/login',
  '/register',
  '/passport/github'
]

// 获取用户请求权限
function getActionUrl(): any[] {
  const local = localStorage.getItem('userInfo')
  if (!local) return []
  const userInfo = JSON.parse(local)
  return userInfo.rights.reduce((arr: any[], item: any) => {
    return item.rights_type === 'action' ? arr.concat({
      url: item.rights_path,
      method: item.rights_method,
    }) : arr
  }, [])
}
// 问题: 必须刷新页面才能更新数据, vue 路由跳转不触发页面更新
const actionUrls = getActionUrl()
// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 白名单判断
    const isWhite = actionWhite.find(url => {
      return config.url?.startsWith(url)
    })

    // 判断是否有请求权限
    console.log(actionUrls);
    const isRequest = actionUrls.find(item => {
      return config.url?.startsWith(item.url) && config.method === item.method
    })

    // 不在白名单且无权限拦截, 否则下一步
    if (isWhite === undefined && isRequest === undefined) {
      config.cancelToken = source.token;
      source.cancel('没有对应的请求权限');
    } else {
      // 所有请求的 headers.Authorization 都携带 access_token
      config.headers.Authorization = localStorage.getItem('act');

      // 更新 token 的请求则携带 refresh_token
      if (config.url?.startsWith(refreshTokenUrl)) {
        config.headers.Authorization = localStorage.getItem('rft');
      }
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
     if (!error.response) return vue.$message.error(error.message);

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
  const refreshRes = await GET(refreshTokenUrl)
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
  const errData = e.response?.data
  errData && errData.meta ?
    vue.$message.error(errData.meta.msg) :
    vue.$message.error(errData.message)
}

// 封装的 get 请求
async function GET (url: string, params?: any, opts?: AxiosRequestConfig): Promise<any> {
  try {
    return await axios.get(url, {params, ...opts})
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
async function DEL (url: string, data?: object, opts?: AxiosRequestConfig): Promise<any> {
  try {
    return await axios.delete(url, { data, ...opts })
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

// 导出 all 函数, 防止循环依赖拿不到
export async function all(reqs: AxiosInstance[]): Promise<AxiosInstance[]> {
  return await axios.all(reqs)
}

export default {
  get: GET,
  post: POST,
  put: PUT,
  delete: DEL,
}
