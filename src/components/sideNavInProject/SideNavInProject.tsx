import React, { Fragment, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Box, MenuList, MenuItem, ListItemText, Avatar, Typography, Button, Drawer, Divider } from '@mui/material'
import { grey, blue, red } from '@mui/material/colors'
import { Assessment, Settings, CardGiftcard } from '@mui/icons-material'
import { styled } from '@mui/system'

const SideMenuDivider = styled(Divider)({
  margin: '0 .5rem'
})
const SideMenuTitle = styled(MenuItem)({
  padding: '.5rem .5rem .5rem .75rem',
  backgroundColor: grey[100]
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
  padding: '.875rem .5rem',
  backgroundColor: grey[300],
  borderLeftStyle: 'solid',
  borderLeftWidth: '.25rem',
  borderLeftColor: grey[400]
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
  // const [subMenuShow, setSubMenuShow] = useState(false)
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
  const overviewItems = [{
    name: 'Summary',
    path: `/${projectId}`,
    key: 'summary'
  },
  {
    name: 'Dashboard',
    path: `/${projectId}/dashboard`,
    key: 'dashboard'
  }]
  // const handleSideMenu = (): void => {
  //   setSubMenuShow(true)
  // }
  const handleMenuItem = (index: number): void => {
    setSelectedIndex(index)
    navigate(sideMenuItems[index].path, { replace: true })
  }
  const handleSubMenuItem = (index: number): void => {
    setSelectedSubIndex(index)
    navigate(overviewItems[index].path, { replace: true })
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
            backgroundColor: grey[100],
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
        <MenuList>
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
                <MenuList>
                  { index === selectedIndex &&
                    overviewItems.map((item, index): any => {
                      return (
                        <SideMenuItem
                          key={item.key}
                          selected={index === selectedSubIndex}
                          onClick={() => handleSubMenuItem(index)}
                        >
                          <Avatar sx={{ width: '1rem', height: '1rem', marginLeft: '.25rem', bgcolor: grey[900] }} variant="rounded">
                            <CardGiftcard sx={{ width: '1rem', height: '1rem' }} />
                          </Avatar>
                          <SideMenuItemText sx={{ marginLeft: '.25rem' }}>
                            {item.name}
                          </SideMenuItemText>
                        </SideMenuItem>
                      )
                    })
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
