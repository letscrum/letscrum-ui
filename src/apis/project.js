import axios from 'axios'

const version = '/v1'

export const getGetProjects = (params) => axios.get(`${version}/projects`, { params })

export const getGetProject = (projectId) => axios.get(`${version}/projects/${projectId}`)

export const postCreateProject = (params) => axios.post(`${version}/projects`, params)
