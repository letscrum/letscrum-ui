import axios from 'axios'

const version = '/v1'

export const getGetOrgs = (params) => axios.get(`${version}/orgs`, { params })

export const getGetOrg = (orgId) => axios.get(`${version}/orgs/${orgId}`)

export const postCreateOrg = (params) => axios.post(`${version}/orgs`, params)
