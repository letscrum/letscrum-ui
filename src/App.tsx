import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PrivateRoute, SideNav, SideNavInProject, TopNav } from './components'
import {
  ProjectListPage, ProjectWorkItemsPage, ProjectPullRequestsPage, ProjectSummaryPage, ProjectDashboardPage, WorkItemsPage,
  CreateBugPage, SignInPage, RouteErrorPage
} from './pages'
import axios from 'axios'
import { useAppSelector } from './redux/hooks'
import { selectUserAccessToken } from './redux/reducers/userSlice'

const HeadersAuth = (): void => {
  const jwt = useAppSelector(selectUserAccessToken)
  // axios.defaults.baseURL = 'http://127.0.0.1:8081/api';
  axios.defaults.baseURL = 'https://imoogoo.com/api'
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  // axios.defaults.headers.Authorization = `Bearer ${jwt}`
  axios.defaults.headers.common.Authorization = `Bearer ${jwt ?? ''}`
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute>
      <TopNav />
    </PrivateRoute>,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: '/',
        element: <SideNav />,
        children: [
          {
            path: '/',
            element: <ProjectListPage />
          },
          {
            path: '/_work',
            element: <ProjectWorkItemsPage />
          },
          {
            path: '/_pulls',
            element: <ProjectPullRequestsPage />
          }
        ]
      },
      {
        path: '/:projectId',
        element: <SideNavInProject />,
        children: [
          {
            path: '/:projectId/',
            element: <ProjectSummaryPage />
          },
          {
            path: '/:projectId/dashboard',
            element: <ProjectDashboardPage />
          },
          {
            path: '/:projectId/_workitems',
            element: <WorkItemsPage />
          },
          {
            path: '/:projectId/_workitems/create/Bug',
            element: <CreateBugPage />
          },
          {
            path: '/:projectId/_workitems/create/Epic',
            element: <CreateBugPage />
          },
          {
            path: '/:projectId/_workitems/create/Feature',
            element: <CreateBugPage />
          },
          {
            path: '/:projectId/_workitems/create/Impediment',
            element: <CreateBugPage />
          },
          {
            path: '/:projectId/_workitems/create/Backlog',
            element: <CreateBugPage />
          },
          {
            path: '/:projectId/_workitems/create/Task',
            element: <CreateBugPage />
          },
          {
            path: '/:projectId/_workitems/create/Test',
            element: <CreateBugPage />
          }
        ]
      }
    ]
  },
  {
    path: '/signIn',
    element: <SignInPage />,
    errorElement: <RouteErrorPage />
  }
])

const App: React.FunctionComponent = () => {
  return (
    <>
      {HeadersAuth()}
      <RouterProvider router={router} />
    </>

  )
}

export default App
