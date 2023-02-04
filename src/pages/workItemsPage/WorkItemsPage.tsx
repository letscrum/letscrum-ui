import React, { useState, MouseEvent } from 'react'
import { Box, Typography, Stack, MenuProps, styled, Menu, Button, MenuItem, alpha, Checkbox, Divider } from '@mui/material'
import { AssignmentTurnedIn, BakeryDining, EmojiEvents, FilterAltOutlined, KeyboardArrowDown, ListAlt, Park, PestControl, Science, Clear } from '@mui/icons-material'
import { amber, blue, deepOrange, deepPurple, grey, purple, red, teal } from '@mui/material/colors'
import { ListOptionsBar } from '../../components'

const initialItemTypes = [
  {
    id: '1',
    key: 'bug',
    title: 'Bug',
    icon: <PestControl sx={{ color: red[900], fontSize: 'small' }} />,
    path: '/',
    checked: false
  },
  {
    id: '2',
    key: 'epic',
    title: 'Epic',
    icon: <BakeryDining sx={{ color: deepOrange[500], fontSize: 'small' }} />,
    path: '/',
    checked: false
  },
  {
    id: '3',
    key: 'feature',
    title: 'Feature',
    icon: <EmojiEvents sx={{ color: deepPurple[900], fontSize: 'small' }} />,
    path: '/',
    checked: false
  },
  {
    id: '4',
    key: 'impediment',
    title: 'Impediment',
    icon: <Park sx={{ color: purple[500], fontSize: 'small' }} />,
    path: '/',
    checked: false
  },
  {
    id: '5',
    key: 'backlog',
    title: 'Product Backlog Item',
    icon: <ListAlt sx={{ color: blue[700], fontSize: 'small' }} />,
    path: '/',
    checked: false
  },
  {
    id: '6',
    key: 'task',
    title: 'Task',
    icon: <AssignmentTurnedIn sx={{ color: amber[900], fontSize: 'small' }} />,
    path: '/',
    checked: false
  },
  {
    id: '7',
    key: 'test',
    title: 'Test Case',
    icon: <Science sx={{ color: teal[700], fontSize: 'small' }} />,
    path: '/',
    checked: false
  }
]

const FilterMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 3,
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '.5rem 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        )
      }
    }
  }
}))

export const WorkItemsPage: React.FunctionComponent = () => {
  const [typesAnchorEl, setTypesAnchorEl] = useState<null | HTMLElement>(null)
  const [workItemTypes, setWorkItemTypes] = useState(initialItemTypes)
  const openTypesMenu = Boolean(typesAnchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>): void => setTypesAnchorEl(event.currentTarget)
  const handleTypesMenuClose = (): void => setTypesAnchorEl(null)
  const handleTypesCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newItemTypes = [...workItemTypes]
    const selectedTypes = newItemTypes.find((item) => item.key === event.target.name)
    if (selectedTypes !== undefined) selectedTypes.checked = event.target.checked
    setWorkItemTypes(newItemTypes)
  }
  return (
    <Box padding='1rem'>
      <Typography sx={{ marginLeft: '.5rem', fontSize: '1.125rem', fontWeight: 'light' }}>
        Work items
      </Typography>
      <ListOptionsBar />
      <Stack direction='row' sx={{ backgroundColor: grey[100] }}>
        <FilterAltOutlined />
        <Button
          id="demo-customized-button"
          sx={{ marginLeft: 'auto' }}
          aria-controls={openTypesMenu ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openTypesMenu ? 'true' : undefined}
          variant="text"
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDown />}
        >
          Options
        </Button>
        <FilterMenu
          id="demo-customized-menu"
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button'
          }}
          anchorEl={typesAnchorEl}
          open={openTypesMenu}
          onClose={handleTypesMenuClose}
        >
          {
            workItemTypes.map((item) => {
              return (
                <MenuItem component='label' key={item.key} disableRipple>
                  <Checkbox
                    sx={{ padding: 0 }}
                    name={item.key}
                    checked={item.checked}
                    onChange={handleTypesCheck}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                  {item.icon}
                  <Typography sx={{
                    fontWeight: 300,
                    fontSize: '.875rem',
                    color: grey[700]
                  }}>
                    {item.title}
                  </Typography>
                </MenuItem>
              )
            })
          }
          <Divider />
          <Stack>
            <Button variant='text' sx={{ marginLeft: 'auto' }} startIcon={<Clear />} >
              Clear
            </Button>
          </Stack>
        </FilterMenu>
      </Stack>
    </Box>
  )
}
