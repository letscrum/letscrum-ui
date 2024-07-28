import axios from 'axios'

const version = '/v1'

export const getGetWorkItems = (orgId, projectId, params) => axios.get(`${version}/orgs/${orgId}/projects/${projectId}/workitems`, { params })

export const postCreateWorkItem = (orgId, projectId, params) => axios.post(`${version}/orgs/${orgId}/projects/${projectId}/workitems`, params)

export const putUpdateWorkItem = (orgId, projectId, params) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}/workitems`, params)

export const deleteDeleteWorkItem = (orgId, projectId, workItemId) => axios.delete(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}`)

export const putUpdateWorkItemStatus = (orgId, projectId, workItemId, params) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}/status`, params)

export const putAssignWorkItem = (orgId, projectId, workItemId, params) => axios.put(`${version}/orgs/${orgId}/projects/${projectId}/workitems/${workItemId}/assign`, params)
