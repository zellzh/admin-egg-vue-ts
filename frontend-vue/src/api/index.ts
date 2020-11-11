import { accountAction } from './url/account'
import { usersAction } from './url/users'
import { rightsAction } from './url/rights'

export default {
  ...accountAction,
  ...usersAction,
  ...rightsAction,
}
