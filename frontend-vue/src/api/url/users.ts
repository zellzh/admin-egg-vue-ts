import actions from "@/api/network";

// users 接口
const url = {
  users: '/api/v1/users',
  avatar: '/api/v1/users/avatars',
  excel: '/api/v1/users/excels',
}

// users 请求方法
export const usersAction = {
  getUsers: (data?: object) => actions.get(url.users, data),
  addUser: (data: object) => actions.post(url.users, data),
  delUser: (id: number) => actions.delete(url.users + `/${id}`),
  updateUser: (id: number, data: object) => actions.put(url.users + `/${id}`, data),
  exportUsers: () => actions.get(url.excel, null, { responseType: 'blob' }),
}

export default url
