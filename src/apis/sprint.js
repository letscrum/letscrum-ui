import axios from 'axios'

const version = '/v1'

export const getGetSprints = (orgId, projectId, params) => axios.get(`${version}/orgs/${orgId}/projects/${projectId}/sprints`, { params })

export const getGetSprint = (orgId, projectId, sprintId) => axios.get(`${version}/orgs/${orgId}/projects/${projectId}/sprints/${sprintId}`)

export const postCreateSprint = (orgId, projectId, params) => axios.post(`${version}/orgs/${orgId}/projects/${projectId}/sprints`, params)

export const putUpdateSprint = (orgId, projectId, sprintId, params) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}/sprints/${sprintId}`, params)

export const putUpdateSprintMembers = (orgId, projectId, sprintId, params) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}/sprints/${sprintId}/members`, params)

export const deleteDeleteSprint = (orgId, projectId, sprintId) => axios.delete(`${version}/orgs/${orgId}/projects/${projectId}/sprints/${sprintId}`)

export const postAddSprintMember = (orgId, projectId, sprintId, params) => axios.post(`${version}/orgs/${orgId}/projects/${projectId}/sprints/${sprintId}/members`, params)

export const deleteRemoveSprintMember = (orgId, projectId, sprintId, userId) => axios.delete(`${version}/orgs/${orgId}/projects/${projectId}/sprints/${sprintId}/members/${userId}`)

export const getSprintTaskBurndown = (orgId, projectId, sprintId) => axios.get(`${version}/orgs/${orgId}/projects/${projectId}/sprints/${sprintId}/task_burndown`)

export const getSprintWorkBurnDown = (orgId, projectId, sprintId) => axios.get(`${version}/orgs/${orgId}/projects/${projectId}/sprints/${sprintId}/work_burndown`)
