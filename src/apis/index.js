import axios from 'axios'

const version = '/v1'

export const postSignIn = (params) => axios.post(`${version}/signin`, params)

export const getVersion = () => axios.get(`${version}/version`)
