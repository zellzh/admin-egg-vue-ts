/*
 * 所有 API 出口
 */
import { accountApi } from './url/account'
import { usersApi } from './url/users'
import { rightsApi } from './url/rights'
import { roleApi } from './url/roles'

export default {
  ...accountApi,
  ...usersApi,
  ...rightsApi,
  ...roleApi,
}
