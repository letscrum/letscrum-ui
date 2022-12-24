import React, { useEffect } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { Box, MenuList, MenuItem, ListItemText, Avatar, Typography, Button, Drawer, Divider } from '@mui/material'
import { grey, blue, red } from '@mui/material/colors'
import { Assessment, Settings, CardGiftcard } from '@mui/icons-material'
import { styled } from '@mui/system'
import { useAppSelector } from '../../redux/hooks'
import { selectUserName } from '../../redux/reducers/userSlice'

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
  const displayName = useAppSelector(selectUserName)
  const displayLetter = displayName?.toString().toUpperCase().charAt(0)
  const location = useLocation()
  console.log(location, location.pathname)
  const { projectId } = useParams()
  useEffect(() => {
    console.log('------', projectId)
  }, [projectId])
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
        <MenuList>
          <SideMenuTitle>
            <Avatar sx={{ width: '1.5rem', height: '1.5rem', bgcolor: red[900] }} variant="rounded">
              <Typography sx={{ fontSize: '.875rem', fontWeight: 300 }}>
                {displayLetter}
              </Typography>
            </Avatar>
            <SideMenuTitleText>
              {displayName}
            </SideMenuTitleText>
          </SideMenuTitle>
          <SideMenuDivider />
          <SideMenuItem>
            <Avatar sx={{ width: '1.5rem', height: '1.5rem', bgcolor: blue[600] }} variant="rounded">
              <Assessment />
            </Avatar>
            <SideMenuItemText>
              Overview
            </SideMenuItemText>
          </SideMenuItem>
          <SideMenuItem>
            <Avatar sx={{ width: '1rem', height: '1rem', marginLeft: '.25rem', bgcolor: grey[900] }} variant="rounded">
              <CardGiftcard sx={{ width: '1rem', height: '1rem' }} />
            </Avatar>
            <SideMenuItemText sx={{ marginLeft: '.25rem' }}>
              Summary
            </SideMenuItemText>
          </SideMenuItem>
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
