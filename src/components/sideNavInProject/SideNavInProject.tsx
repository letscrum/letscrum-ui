import React, { Fragment, useState, ReactElement } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Box, MenuList, MenuItem, ListItemText, Avatar, Typography, Button, Drawer, Divider } from '@mui/material'
import { grey, blue, red } from '@mui/material/colors'
import { Assessment, Settings, CardGiftcard } from '@mui/icons-material'
import { styled } from '@mui/system'

const SideMenuDivider = styled(Divider)({
  margin: '0 .5rem'
})
const SideMenuTitle = styled(MenuItem)({
  padding: '.75rem .5rem .25rem .75rem',
  backgroundColor: grey[200]
})
const SideMenuTitleText = styled(ListItemText)({
  '& .MuiTypography-root': {
    paddingLeft: '.75rem',
    fontSize: '.875rem',
    fontWeight: 'bold',
    color: grey[800]
  }
})
const SideMenuItem = styled(MenuItem)({
  padding: '.75rem .5rem',
  backgroundColor: grey[200],
  borderLeftStyle: 'solid',
  borderLeftWidth: '.25rem',
  borderLeftColor: grey[500],
  '& .Mui-selected': {
    backgroundColor: red[300]
  }
})
const SideSubMenuItem = styled(MenuItem)({
  padding: '.6125rem .5rem',
  backgroundColor: grey[200],
  borderLeftStyle: 'solid',
  borderLeftWidth: '.25rem',
  borderLeftColor: grey[500],
  '& .Mui-selected': {
    backgroundColor: red[300]
  }
})
const SideMenuItemText = styled(ListItemText)({
  '& .MuiTypography-root': {
    paddingLeft: '.75rem',
    fontSize: '.875rem',
    fontWeight: 'medium',
    color: grey[800]
  }
})
const SetOrgButton = styled(Button)({
  width: '16rem',
  color: grey[800],
  justifyContent: 'start',
  paddingLeft: '1rem',
  margin: '.5rem auto',
  fontSize: '.75rem',
  '&:hover': {
    backgroundColor: grey[100]
  }
})

export const SideNavInProject: React.FunctionComponent = () => {
  const [selectedSubIndex, setSelectedSubIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  let { projectId } = useParams()
  projectId = projectId ?? ''
  console.log('location: ', location, 'projectID: ', projectId)
  const sideMenuItems = [{
    name: 'Overview',
    path: `/${projectId}`,
    key: 'overview',
    children: [{
      name: 'Summary',
      path: `/${projectId}`,
      key: 'summary'
    },
    {
      name: 'Dashboard',
      path: `/${projectId}/dashboard`,
      key: 'dashboard'
    }]
  },
  {
    name: 'Boards',
    path: `/${projectId}`,
    key: 'boards'
  }
  ]
  const handleMenuItem = (index: number): void => {
    setSelectedIndex(index)
    navigate(sideMenuItems[index].path, { replace: true })
  }
  const handleSubMenuItem = (path: string, index: number): void => {
    setSelectedSubIndex(index)
    navigate(path, { replace: true })
  }
  return (
    <Box display='flex'>
      <Drawer
        sx={{
          width: '16rem',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            top: 'calc(3rem + 1px)',
            height: 'calc(100% - 3rem - 1px)',
            backgroundColor: grey[200],
            boxSizing: 'border-box',
            overflowX: 'visible'
          }
        }}
        variant="permanent"
        anchor="left"
      >
        <SideMenuTitle>
          <Avatar sx={{ width: '1.5rem', height: '1.5rem', bgcolor: red[900] }} variant="rounded">
            <Typography sx={{ fontSize: '.875rem', fontWeight: 300 }}>
              i
            </Typography>
          </Avatar>
          <SideMenuTitleText>
            iMoogoo
          </SideMenuTitleText>
        </SideMenuTitle>
        <SideMenuDivider />
        {/* menu list */}
        <MenuList sx={{ padding: 0 }}>
          {sideMenuItems.map((item, index) => {
            return (
              <Fragment key={item.key}>
                <SideMenuItem
                  selected={index === selectedIndex}
                  onClick={() => handleMenuItem(index)}
                >
                  <Avatar sx={{ width: '1.5rem', height: '1.5rem', bgcolor: blue[600] }} variant="rounded">
                    <Assessment />
                  </Avatar>
                  <SideMenuItemText>
                    {item.name}
                  </SideMenuItemText>
                </SideMenuItem>
                <MenuList sx={{ padding: 0 }}>
                  {index === selectedIndex && (((item?.children) != null) && item.children.map((item, index): ReactElement => {
                    return (
                      <SideSubMenuItem
                        key={item.key}
                        selected={index === selectedSubIndex}
                        onClick={() => handleSubMenuItem(item.path, index)}
                      >
                        <Avatar sx={{ width: '1rem', height: '1rem', marginLeft: '.25rem', bgcolor: grey[900] }} variant="rounded">
                          <CardGiftcard sx={{ width: '1rem', height: '1rem' }} />
                        </Avatar>
                        <SideMenuItemText sx={{ marginLeft: '.25rem' }}>
                          {item.name}
                        </SideMenuItemText>
                      </SideSubMenuItem>
                    )
                  })
                  )
                  }
                </MenuList>
              </Fragment>
            )
          })}
        </MenuList>
        <SideMenuDivider sx={{ marginTop: 'auto' }} />
        <SetOrgButton startIcon={<Settings />}>
          Organization settings
        </SetOrgButton>
      </Drawer>
      <Outlet />
    </Box>
  )
}
