import axios from 'axios'

const version = '/v1'

export const getGetSprints = (projectId, params) => axios.get(`${version}/projects/${projectId}/sprints`, { params })

export const getGetSprint = (projectId, sprintId) => axios.get(`${version}/projects/${projectId}/sprints/${sprintId}`)

export const postCreateSprint = (projectId, params) => axios.post(`${version}/projects/${projectId}/sprints`, params)

export const putUpdateSprintMembers = (projectId, sprintId, params) => axios.put(`${version}/projects/${projectId}/sprints/${sprintId}/members`, { params })

export const deleteDeleteSprint = (projectId, sprintId) => axios.delete(`${version}/projects/${projectId}/sprints/${sprintId}`)
