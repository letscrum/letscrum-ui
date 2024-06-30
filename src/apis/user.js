import axios from 'axios'

const version = '/v1'

export const getUsers = (params) => axios.get(`${version}/users`, { params })

export const getUser = (userId) => axios.get(`${version}/users/${userId}`)
