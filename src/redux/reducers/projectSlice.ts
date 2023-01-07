import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import axios from 'axios'

interface ProjectState {
  loading: boolean
  error: any
  id: string | null
  displayName: string | null
}
const initialState: ProjectState = {
  loading: false,
  error: null,
  id: null,
  displayName: null
}

export const fecthProject = createAsyncThunk(
  'project/get',
  async (params: { id: string }) => {
    try {
      const projectData: any = await axios.get(`/v1/projects/${params.id}`)
      return projectData.data.item
    } catch (e: any) {
      return e.message
    }
  }
)
export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fecthProject.pending, (state) => {
        state.loading = true
      })
      .addCase(fecthProject.fulfilled, (state, action) => {
        state.loading = false
        state.id = action.payload.id
        state.displayName = action.payload.displayName
      })
      .addCase(fecthProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})
export const selectProjcetLoading = (state: RootState): boolean => state.project.loading
export const selectProjectError = (state: RootState): any => state.project.error
export const selectProjectId = (state: RootState): string | null => state.project.id
export const selectProjectDisplayName = (state: RootState): string | null => state.project.displayName
export default projectSlice.reducer
