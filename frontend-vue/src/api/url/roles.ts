/*
 * 角色列表 url 和 api
 */
import actions from "@/api/network";

// role url
const url = {
  role: '/api/v1/roles',
  assignRole: '/api/v1/mgsRoles'
}

// role api
export const roleApi = {
  // 分页 | 查询所有
  getRoles: (data?: object) => actions.get(url.role, data),
  addRole: (data: object) => actions.post(url.role, data),
  delRole: (id: number) => actions.delete(url.role + `/${id}`),
  updateRole: (id: string, data: object) => actions.put(`${url.role}/${id}`, data),
  // 分配角色
  addUserRole: (data: object) => actions.post(url.assignRole, data),
  delUserRole: (uid: number, data: object) => actions.delete(`${url.assignRole}/${uid}`, data),
}

export default url
