import React, { useState, ReactElement, useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Box, Stack, MenuList, MenuItem, ListItemIcon, ListItemText, Avatar, Typography, Button, Drawer, Divider } from '@mui/material'
import { grey, blue, red } from '@mui/material/colors'
import { Assessment, Dashboard, FactCheck, Settings, CardGiftcard, Add } from '@mui/icons-material'
import { styled } from '@mui/system'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fecthProject, selectProjcetLoading, selectProjectDisplayName, selectProjectError } from '../../redux/reducers/projectSlice'

const SideMenuDivider = styled(Divider)({
  margin: '0 .5rem'
})
const SideMenuTitle = styled(Stack)({
  padding: '0',
  backgroundColor: grey[200]
})
const SideMenuTitleText = styled(ListItemText)({
  margin: '0',
  '& .MuiTypography-root': {
    height: '3rem',
    lineHeight: '3rem',
    fontSize: '.875rem',
    fontWeight: 'bold',
    color: grey[800]
  }
})
const SideMemuCreateBtn = styled(Button)({
  color: grey[500]
})
const SideMenuItem = styled(MenuItem)({
  padding: '0',
  backgroundColor: grey[200],
  borderRadius: '2px',
  ':before': {
    bottom: 0,
    content: '""',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '.25rem',
    backgroundColor: grey[500]
  },
  '.Mui-selected': {
    backgroundColor: red[300]
  }
})
const SideMenuIconWrapper = styled(ListItemIcon)({
  display: 'flex',
  width: '3rem',
  height: '3rem',
  justifyContent: 'center',
  alignItems: 'center'
})
const SideSubMenuIconWrapper = styled(ListItemIcon)({
  display: 'flex',
  width: '2.875rem',
  height: '2.875rem',
  justifyContent: 'center',
  alignItems: 'center'
})
const SideMenuItemText = styled(ListItemText)({
  '& .MuiTypography-root': {
    fontSize: '.875rem',
    fontWeight: 500,
    color: grey[800]
  }
})
const SideSubMenuItem = styled(MenuItem)({
  padding: '0',
  backgroundColor: grey[200],
  ':before': {
    bottom: 0,
    content: '""',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '.25rem',
    backgroundColor: blue[700]
  },
  '.Mui-selected': {
    backgroundColor: red[300]
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
  const { projectId } = useParams()
  const id = projectId ?? ''
  const loading = useAppSelector(selectProjcetLoading)
  const error = useAppSelector(selectProjectError)
  const displayName = useAppSelector(selectProjectDisplayName)
  const displayLetter = displayName?.toString().toUpperCase().charAt(0)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fecthProject({ id }))
      .catch(() => alert(error))
  }, [])
  const sideMenuItems = [{
    name: 'Overview',
    path: '',
    key: 'overview',
    icon: <Assessment sx={{ fontSize: '1.75rem', color: blue[700] }} />,
    children: [{
      name: 'Summary',
      path: '',
      key: 'summary',
      icon: <CardGiftcard sx={{ fontSize: '1rem' }} />
    },
    {
      name: 'Dashboard',
      path: 'dashboard',
      key: 'dashboard',
      icon: <Dashboard sx={{ fontSize: '1rem' }} />
    }]
  },
  {
    name: 'Boards',
    path: '',
    key: 'boards',
    icon: <FactCheck sx={{ fontSize: '1.75rem', color: blue[700] }} />,
    children: []
  }]
  const handleMenuItem = (path: string, index: number): void => {
    setSelectedIndex(index)
    navigate(path, {
      state: {
        menuIndex: {
          name: sideMenuItems[selectedIndex].name,
          path: sideMenuItems[selectedIndex].path
        }
      }
    })
  }
  const handleSubMenuItem = (path: string, index: number): void => {
    setSelectedSubIndex(index)
    console.log(index, ': ', sideMenuItems[selectedIndex].children[index].name)
    navigate(path, {
      state: {
        menuIndex: {
          name: sideMenuItems[selectedIndex].name,
          path: sideMenuItems[selectedIndex].path
        },
        subMenuIndex: {
          name: sideMenuItems[selectedIndex].children[index].name,
          path: sideMenuItems[selectedIndex].children[index].path
        }
      }
    })
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
        <SideMenuTitle direction='row'>
          <SideMenuIconWrapper sx={{ minWidth: '3rem' }}>
            <Avatar sx={{ width: '1.5rem', height: '1.5rem', bgcolor: red[900] }} variant="rounded">
              <Typography sx={{ fontSize: '.875rem', fontWeight: 300 }}>
                {displayLetter}
              </Typography>
            </Avatar>
          </SideMenuIconWrapper>
          <SideMenuTitleText>
            {
              loading
                ? 'loading data'
                : displayName
            }
          </SideMenuTitleText>
          <SideMemuCreateBtn>
            <Add sx={{ color: grey[700] }} />
          </SideMemuCreateBtn>
        </SideMenuTitle>
        <SideMenuDivider />
        {/* menu list */}
        <MenuList sx={{ padding: '.25rem 0' }}>
          {sideMenuItems.map((item, index) => {
            return (
              <div key={item.key}>
                <SideMenuItem
                  selected={index === selectedIndex}
                  id={`menu-${index}`}
                  onClick={() => handleMenuItem(item.path, index)}
                >
                  <SideMenuIconWrapper sx={{ maxWidth: '3rem' }}>
                    {item.icon}
                  </SideMenuIconWrapper>
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
                        <SideSubMenuIconWrapper sx={{}}>
                          {item.icon}
                        </SideSubMenuIconWrapper>
                        <SideMenuItemText>
                          {item.name}
                        </SideMenuItemText>
                      </SideSubMenuItem>
                    )
                  })
                  )
                  }
                </MenuList>
              </div>
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
