import axios from 'axios'

const version = '/v1'

export const getGetTasks = (projectId, workItemId, params) => axios.get(`${version}/projects/${projectId}/workitems/${workItemId}/tasks`, { params })

export const postCreateTask = (projectId, workItemId, params) => axios.post(`${version}/projects/${projectId}/workitems/${workItemId}/tasks`, params)

export const putUpdateTask = (projectId, workItemId, taskId, params) => axios.put(`${version}/projects/${projectId}/workitems/${workItemId}/tasks//${taskId}`, params)

export const deleteDeleteTask = (projectId, workItemId, taskId) => axios.delete(`${version}/projects/${projectId}/workitems/${workItemId}/tasks/${taskId}`)

export const putUpdateTaskStatus = (projectId, workItemId, taskId, params) => axios.put(`${version}/projects/${projectId}/workitems/${workItemId}/tasks/${taskId}/status`, params)

export const putAssignTask = (projectId, workItemId, taskId, params) => axios.put(`${version}/projects/${projectId}/workitems/${workItemId}/tasks/${taskId}/assign`, params)
