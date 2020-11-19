/*
 * 所有 url 出口
 */
import account, { refreshTokenUrl } from './account'
import users from './users'
import rights from './rights'
import roles from './roles'

// domain: 使用 process.env
const baseUrl = process.env.VUE_APP_BASE_API;

export {
  baseUrl,
  refreshTokenUrl,
  account,
  users,
  rights,
  roles,
}

export default {
  ...account,
  ...users,
  ...rights,
  ...roles,
  baseUrl,
  refreshTokenUrl,
}
