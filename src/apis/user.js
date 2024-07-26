import axios from 'axios'

const version = '/v1'

export const getGetUsers = (params) => axios.get(`${version}/users`, { params })

export const getGetUser = (userId) => axios.get(`${version}/users/${userId}`)

export const postCreateUser = (params) => axios.post(`${version}/users`, params)

export const putUpdateUser = (userId, params) => axios.put(`${version}/users/${userId}`, params)

export const deleteDeleteUser = (userId) => axios.delete(`${version}/users/${userId}`)

export const putUpdateUserPassword = (userId, params) => axios.put(`${version}/users/${userId}/password`, params)

export const putSetSuperAdmin = (userId, isSuperAdmin) => axios.put(`${version}/users/${userId}/super_admin/${isSuperAdmin}`)

export const putResetPassword = (userId, params) => axios.put(`${version}/users/${userId}/reset_password`, params)

export const putUpdatePassword = (userId, params) => axios.put(`${version}/users/${userId}/password`, params)
