import axios from 'axios'
import router from '@/router'
import { useAppStore } from '@/stores/app'

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const store = useAppStore()
      store.signOut()
      router.push({ name: 'SignIn' })
    }
    return Promise.reject(error)
  }
)
