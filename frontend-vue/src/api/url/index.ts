import account, { refreshTokenApi } from './account'
import users from './users'
import rights from './rights'
import roles from './roles'

// domain: 使用 process.env
const baseUrl = process.env.VUE_APP_BASE_API;

export {
  baseUrl,
  refreshTokenApi,
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
  refreshTokenApi,
}
