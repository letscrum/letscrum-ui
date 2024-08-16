import axios from 'axios'

const version = '/v1'

export const getGetOrgs = (params) => axios.get(`${version}/orgs`, { params })

export const getGetOrg = (orgId) => axios.get(`${version}/orgs/${orgId}`)

export const postCreateOrg = (params) => axios.post(`${version}/orgs`, params)

export const deleteDeleteOrg = (orgId) => axios.delete(`${version}/orgs/${orgId}`)

export const getGetOrgMembers = (orgId) => axios.get(`${version}/orgs/${orgId}/members`)

export const postAddOrgMembers = (orgId, params) => axios.post(`${version}/orgs/${orgId}/members`, params)

export const deleteRemoveOrgMember = (orgId, memberId) => axios.delete(`${version}/orgs/${orgId}/members/${memberId}`)

export const getSetOrgAdmin = (orgId, memberId, isAdmin) => axios.get(`${version}/orgs/${orgId}/members/${memberId}/admin/${isAdmin}`)
