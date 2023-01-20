import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import axios from 'axios'

interface ProjectState {
  loading: boolean
  error: any
  id: string | null
  displayName: string | null
  description: string | null
  members: Array<{
    userId: string | null
    userName: string | null
  }>
  updateLoading: boolean
  updateError: any
}
const initialState: ProjectState = {
  loading: false,
  error: null,
  id: null,
  displayName: null,
  description: null,
  members: [{
    userId: null,
    userName: null
  }],
  updateLoading: false,
  updateError: null
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
export const updateProject = createAsyncThunk(
  'project/update',
  async (params: { id: string, displayName: string | null, newDescription: string | null }) => {
    try {
      const response = await axios.put(`/v1/projects/${params.id}`, {
        displayName: params.displayName,
        description: params.newDescription
      })
      return response.data
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
        state.description = action.payload.description
        state.members = action.payload.members
      })
      .addCase(fecthProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateProject.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(updateProject.fulfilled, (state) => {
        state.updateLoading = false
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload
      })
  }
})
export const selectProjcetLoading = (state: RootState): boolean => state.project.loading
export const selectProjectError = (state: RootState): any => state.project.error
export const selectProjcetUpdateLoading = (state: RootState): boolean => state.project.updateLoading
export const selectProjectUpdateError = (state: RootState): any => state.project.updateError
export const selectProjectId = (state: RootState): string | null => state.project.id
export const selectProjectDisplayName = (state: RootState): string | null => state.project.displayName
export const selectProjectDescription = (state: RootState): string | null => state.project.description
export const selectProjectMembers = (state: RootState): Array<{
  userId: string | null
  userName: string | null
}> => state.project.members
export default projectSlice.reducer
