import actions from "@/api/network";

// users 接口
const url = {
  rights: 'api/v1/rights',
}

// users 请求方法
export const rightsAction = {
  getRights: (data?: object) => actions.get(url.rights, data),
  addRights: '',
  delRights: '',
  updateRights: '',
}

export default url
