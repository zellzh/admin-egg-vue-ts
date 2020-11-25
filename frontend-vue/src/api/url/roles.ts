/*
 * 角色列表 url 和 api
 */
import actions from "@/api/network";

// role url
const url = {
  role: '/api/v1/roles',
  assignRights: '/api/v1/rolesRights'
}

// role api
export const roleApi = {
  // 分页 | 查询所有
  getRoles: (data?: object) => actions.get(url.role, data),
  addRole: (data: object) => actions.post(url.role, data),
  delRole: (id: number) => actions.delete(url.role + `/${id}`),
  updateRole: (id: string, data: object) => actions.put(`${url.role}/${id}`, data),
  // 分配角色
  addRoleRights: (data: object) => actions.post(url.assignRights, data),
  delRoleRights: (rid: number, data: object) => actions.delete(`${url.assignRights}/${rid}`, data),
}

export default url
