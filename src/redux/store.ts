import { configureStore } from '@reduxjs/toolkit'
import { projectsSlice } from './reducers/projectsSlice'
import { userSlice } from './reducers/userSlice'

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    projects: projectsSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
