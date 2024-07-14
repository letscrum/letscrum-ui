import axios from 'axios'

const version = '/v1'

export const getGetWorkItems = (projectId, params) => axios.get(`${version}/projects/${projectId}/workitems`, { params })

export const postCreateWorkItem = (projectId, params) => axios.post(`${version}/projects/${projectId}/workitems`, params)

export const putUpdateWorkItem = (projectId, params) => axios.put(`${version}/projects/${projectId}/workitems`, params)

export const deleteDeleteWorkItem = (projectId, workItemId) => axios.delete(`${version}/projects/${projectId}/workitems/${workItemId}`)

export const putUpdateWorkItemStatus = (projectId, workItemId, params) => axios.put(`${version}/projects/${projectId}/workitems/${workItemId}/status`, params)

export const putAssignWorkItem = (projectId, workItemId, params) => axios.put(`${version}/projects/${projectId}/workitems/${workItemId}/assign`, params)
