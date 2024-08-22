import axios from 'axios'

const version = '/v1'

export const getGetProjects = (orgId, params) => axios.get(`${version}/orgs/${orgId}/projects`, { params })

export const getGetProject = (orgId, projectId) => axios.get(`${version}/orgs/${orgId}/projects/${projectId}`)

export const postCreateProject = (orgId, params) => axios.post(`${version}/orgs/${orgId}/projects`, params)

export const putUpdateProject = (orgId, projectId, params) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}`, params)

export const deleteDeleteProject = (orgId, projectId) => axios.delete(`${version}/orgs/${orgId}/projects/${projectId}`)

export const putSetProjectAdmin = (orgId, projectId, userId, isAdmin) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}/members/${userId}/admin/${isAdmin}`)
