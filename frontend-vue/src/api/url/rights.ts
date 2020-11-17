import actions from "@/api/network";

// users 接口
const url = {
  rights: '/api/v1/rights',
  parentRights: '/api/v1/rights/parents'
}

// users 请求方法
export const rightsAction = {
  // 分页 | 查询所有
  getRights: (type?: string|object, data?: object) => {
    type = type || 'list'
    if (type.constructor === Object) {
      data = type as object;
      type = 'list'
    }
    return actions.get(url.rights + `/${type}`, data)
  },
  getParentRights: (level: number) => actions.get(url.parentRights + `/${level}`),
  addRights: (data: object) => actions.post(url.rights, data),
  delRights: (id: string) => actions.delete(url.rights + `/${id}`),
  updateRights: (id: string, data: object) => actions.put(url.rights + `/${id}`, data),
}

export default url
