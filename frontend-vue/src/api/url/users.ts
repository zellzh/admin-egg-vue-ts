/*
 * 用户列表 url 和 api
 */
import actions from "@/api/network";

// users url
const url = {
  users: '/api/v1/users',
  avatar: '/api/v1/users/avatars',
  excel: '/api/v1/users/excels',
}

// users api
export const usersApi = {
  getUsers: (data?: object) => actions.get(url.users, data),
  addUser: (data: object) => actions.post(url.users, data),
  delUser: (id: number) => actions.delete(url.users + `/${id}`),
  updateUser: (id: number, data: object) => actions.put(url.users + `/${id}`, data),
  exportUsers: () => actions.get(url.excel, null, { responseType: 'blob' }),
}

export default url
