// axios 请求数据
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {baseUrl, refreshTokenUrl} from './url'
import { MessageBox, Message } from 'element-ui'
import router from '../router'

axios.defaults.baseURL = baseUrl
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true // 开启携带 cookie

const source = axios.CancelToken.source() // 取消请求
// 请求白名单
const whiteUrls: any[] = [

]

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 白名单: 暂时为非 /api/v1 开头的
    const isWhiteUrl = !config.url?.startsWith('/api/v1')

    // 判断是否有请求权限
    const actionUrls = JSON.parse(localStorage.getItem('actionRights') || '[]')
    const isRequest = actionUrls.some((item: any) => {
      return config.url?.startsWith(item.url) && config.method === item.method
    })

    // 不在白名单且无权限拦截, 否则下一步
    if (!isWhiteUrl && !isRequest) {
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
  }, async error => {
    // 注意点: error 分为 --- 服务器未响应 | 服务器已响应
    // 服务器响应错误
    if (error.response) {
      return responseErrHandler(error.response)
    } else {
      // 服务器未响应错误
      Message.error(error.message)
    }
  })

// 响应错误统一处理
async function responseErrHandler(res: AxiosResponse) {
  switch (res.status) {
    case 401: // token 权限处理
      return tokenExpireHandler(res)
    default:
      Message.error(res.data.meta.msg)
      break;
  }
}

// token 过期处理
async function tokenExpireHandler(res: AxiosResponse) {
  // 40010 - access_token 过期
  if (res.data.meta.code === 40010) {
    return await updateToken(res)
  }

  // 40011 - refresh_token 过期
  if (res.data.meta.code === 40011) {
    MessageBox.confirm('登录已过期, 是否重新登录?', '提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      // 确定后, 删除 refresh_token, 并刷新页面触发导航守卫跳转
      localStorage.removeItem('rft')
      localStorage.removeItem('act')
      router.push('/login')
    }).catch(() => {
      Message.info('已取消, 继续停留在该页面')
    })
    return
  }
}

// 刷新 token
async function updateToken(response: AxiosResponse) {
  console.log('更新 token ---------------');
  // 请求更新 access_token
  const res = await GET(refreshTokenUrl)
  if (res?.status === 200) {
    const act = res.data.data.access_token
    // 保存新的 token
    localStorage.setItem('act', act)
    // 携带新的 token 重新发起过期之前的请求
    const config = response.config
    config.headers['Authorization'] = act
    // 注意: 需要返回重新请求的结果, 否则之前的请求未获取到数据导致 bug
    return axios.request(config)
  }
}

// 封装的 get 请求
async function GET (url: string, params?: any, opts?: AxiosRequestConfig): Promise<AxiosResponse | undefined> {
  return axios.get(url, { params, ...opts })
}

// 封装的 post 请求
async function POST (url: string, params?: any, opts?: AxiosRequestConfig): Promise<AxiosResponse | undefined> {
  return axios.post(url, params, opts)
}

// 封装的 delete 请求
async function DEL (url: string, data?: object, opts?: AxiosRequestConfig): Promise<AxiosResponse | undefined> {
  return axios.delete(url, { data, ...opts })
}

// 封装的 put 请求
async function PUT (url: string, params?: any, opts?: AxiosRequestConfig): Promise<AxiosResponse | undefined> {
  return axios.put(url, params, opts)
}

// 导出 all 函数, 防止循环依赖拿不到
export async function all(reqs: AxiosInstance[]) {
  return await axios.all(reqs)
}

export default {
  get: GET,
  post: POST,
  put: PUT,
  delete: DEL,
}
