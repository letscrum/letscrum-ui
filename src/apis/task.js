import axios from 'axios'

const version = '/v1'

export const getGetTasks = (orgId, projectId, workItemId, params) => axios.get(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}/tasks`, { params })

export const getGetTask = (orgId, projectId, workItemId, taskId) => axios.get(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}/tasks/${taskId}`)

export const postCreateTask = (orgId, projectId, workItemId, params) => axios.post(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}/tasks`, params)

export const putUpdateTask = (orgId, projectId, workItemId, taskId, params) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}/tasks//${taskId}`, params)

export const deleteDeleteTask = (orgId, projectId, workItemId, taskId) => axios.delete(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}/tasks/${taskId}`)

export const putUpdateTaskStatus = (orgId, projectId, workItemId, taskId, params) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}/tasks/${taskId}/status`, params)

export const putAssignTask = (orgId, projectId, workItemId, taskId, params) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}/tasks/${taskId}/assign`, params)

export const putMoveTask = (orgId, projectId, workItemId, taskId, params) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}/tasks/${taskId}/move`, params)

export const putReOrderTasks = (orgId, projectId, workItemId, params) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}/tasks/reorder`, params)
