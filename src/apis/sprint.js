import axios from 'axios'

const version = '/v1'

export const getGetSprints = (projectId, params) => axios.get(`${version}/projects/${projectId}/sprints`, { params })

export const postCreateSprint = (projectId, params) => axios.post(`${version}/projects/${projectId}/sprints`, params)

export const getGetSprintMembers = (projectId, sprintId, params) => axios.get(`${version}/projects/${projectId}/sprints/${sprintId}/members`, { params })
