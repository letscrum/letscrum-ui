import React, { useState } from 'react'
import { Box, Typography, Stack, MenuProps, styled, Menu, Button, MenuItem, alpha, Checkbox, Divider, Theme, Avatar, IconButton, Tooltip, InputAdornment, TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import {
  AssignmentTurnedIn, BakeryDining, EmojiEvents, FilterAltOutlined, KeyboardArrowDown, ListAlt, Park, PestControl, Science, Clear,
  Shortcut, FileCopyOutlined, EmailOutlined, PersonOutlineOutlined, MoreHorizOutlined
} from '@mui/icons-material'
import { amber, blue, deepOrange, deepPurple, grey, purple, red, teal } from '@mui/material/colors'
import { DataGrid, GridActionsCellItem, GridCellParams, GridColumns } from '@mui/x-data-grid'
import { randomUpdatedDate } from '@mui/x-data-grid-generator'
import clsx from 'clsx'
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

const initialAssignedTo = [
  {
    id: '1',
    key: 'me',
    name: '@me',
    avatar: null,
    checked: false
  },
  {
    id: '2',
    key: 'unassigned',
    name: 'Unassigned',
    avatar: null,
    checked: false
  },
  {
    id: '3',
    key: 'wilsonwu',
    name: 'WilsonWu',
    avatar: <Avatar sx={{ width: 16, height: 16 }}>
      <Typography sx={{ fontSize: '.5rem' }}>
        WW
      </Typography>
    </Avatar>,
    checked: false
  }
]

const initialStates = [
  {
    id: '1',
    key: 'new',
    name: 'New',
    icon: <div style={{ width: '.5rem', height: '.5rem', borderRadius: '50%', backgroundColor: grey[400] }} />,
    checked: false
  },
  {
    id: '2',
    key: 'todo',
    name: 'To Do',
    icon: <div style={{ width: '.5rem', height: '.5rem', borderRadius: '50%', backgroundColor: grey[400] }} />,
    checked: false
  }
]

const initialArea = [
  {
    id: '1',
    key: 'imoogoo',
    name: 'imoogoo',
    checked: false
  }
]

const initialTags = [
  {
    id: '1',
    name: 'imoogoo',
    checked: false
  },
  {
    id: '2',
    name: 'azure',
    checked: false
  },
  {
    id: '3',
    name: 'devOps',
    checked: false
  },
  {
    id: '4',
    name: 'Letscrum',
    checked: false
  }
]

const rows = [
  { id: 1, type: 'bug', title: 'Shoveling Snow', assign: 'Jon', state: 'open', area: 'Canada', tags: 'Tags', comments: 'Comments', activity: randomUpdatedDate() },
  { id: 3, type: 'test', title: 'Padding', assign: 'Anna', state: 'To Do', area: 'Canada', tags: 'Summer', comments: 'Comments', activity: randomUpdatedDate() }
]

// if use RowType, will be imcampable error
// type RowType = typeof rows[number]

// eslint-disable-next-line @typescript-eslint/space-before-function-paren
function customCheckbox(theme: Theme): any {
  return {
    '& .MuiCheckbox-root svg': {
      width: 12,
      height: 12,
      backgroundColor: 'transparent',
      border: `2px solid ${theme.palette.mode === 'light' ? grey[400] : 'rgb(67, 67, 67)'}`,
      borderRadius: '50%'
    },
    '& .MuiCheckbox-root svg path': {
      display: 'none'
    },
    '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
      backgroundColor: '#1890ff',
      borderColor: '#1890ff'
    },
    '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
      position: 'absolute',
      display: 'table',
      border: '2px solid #fff',
      borderTop: 0,
      borderLeft: 0,
      transform: 'rotate(45deg) translate(-50%,-50%)',
      opacity: 1,
      transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
      content: '""',
      top: '50%',
      left: '39%',
      width: 5.71428571,
      height: 9.14285714
    },
    '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
      width: 8,
      height: 8,
      backgroundColor: '#1890ff',
      transform: 'none',
      top: '39%',
      border: 0
    }
  }
}

const CheckboxStyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  '& .MuiDataGrid-iconSeparator': {
    display: 'none'
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    border: 'none'
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: 'none'
  },
  ...customCheckbox(theme)
}))

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
  const columns = React.useMemo<GridColumns>(
    () => [
      { field: 'id', headerName: 'ID', width: 70, headerClassName: 'dataGrid--header' },
      {
        field: 'type',
        headerName: 'Type',
        width: 14,
        sortable: false,
        renderCell: (params) => {
          if (params.value === 'bug') return <PestControl sx={{ color: red[900], fontSize: 'small' }} />
          return <AssignmentTurnedIn sx={{ color: amber[900], fontSize: 'small' }} />
        },
        headerClassName: 'dataGrid--header'
      },
      {
        field: 'title',
        headerName: 'Title',
        width: 200,
        cellClassName: (params: GridCellParams<string>): any => {
          if (params.value == null) {
            return ''
          }
          return clsx('titleColumn--hover')
        },
        headerClassName: 'dataGrid--header'
      },
      {
        field: 'actions',
        type: 'actions',
        getActions: () => [
          <GridActionsCellItem
            key='open'
            icon={<Shortcut sx={{ fontSize: 'large', color: grey[700] }} />}
            label='Open selected items in Queries'
            sx={{ color: grey[800], fontSize: '.875rem', fontWeight: '400' }}
            showInMenu
          />,
          <GridActionsCellItem
            key='copy'
            icon={<FileCopyOutlined sx={{ fontSize: 'large', color: grey[700] }} />}
            label='Copy to clipboard'
            sx={{ color: grey[800], fontSize: '.875rem', fontWeight: '400' }}
            showInMenu
          />,
          <GridActionsCellItem
            key='email'
            icon={<EmailOutlined sx={{ fontSize: 'large', color: grey[700] }} />}
            label='Email'
            sx={{ color: grey[800], fontSize: '.875rem', fontWeight: '400' }}
            showInMenu
          />
        ]
      },
      {
        field: 'assign',
        headerName: 'Assign To',
        width: 120,
        sortable: false,
        renderCell: (params) => {
          if (params.value == null || params.value === undefined || params.value === '') {
            return (
              <Stack direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: '1rem', height: '1rem' }}>
                  <PersonOutlineOutlined />
                </Avatar>
                <Typography sx={{ fontSize: '.875rem', marginLeft: '.25rem' }}>
                  {params.value}
                </Typography>
              </Stack>
            )
          }
          return (
            <Stack direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: '1rem', height: '1rem' }} >
                <Typography sx={{ fontSize: '.5rem' }}>
                  {params.value}
                </Typography>
              </Avatar>
              <Typography sx={{ fontSize: '.875rem', marginLeft: '.25rem' }}>
                {params.value}
              </Typography>
            </Stack>
          )
        },
        headerClassName: 'dataGrid--header'
      },
      {
        field: 'state',
        headerName: 'State',
        width: 80,
        sortable: false,
        renderCell: (params) => {
          return (
            <Stack direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '.5rem', height: '.5rem', borderRadius: '50%', backgroundColor: grey[400] }} />
              <Typography sx={{ fontSize: '.875rem', marginLeft: '.5rem' }}>
                {params.value}
              </Typography>
            </Stack>
          )
        },
        headerClassName: 'dataGrid--header'
      },
      { field: 'area', headerName: 'Area Path', width: 120, sortable: false, headerClassName: 'dataGrid--header' },
      { field: 'tags', headerName: 'Tags', width: 120, sortable: false, headerClassName: 'dataGrid--header' },
      { field: 'comments', headerName: 'Comments', width: 90, sortable: false, headerClassName: 'dataGrid--header' },
      { field: 'activity', headerName: 'Activity Date', type: 'dateTime', width: 180, sortable: false, headerClassName: 'dataGrid--header' }
    ],
    []
  )
  // types fiter control
  const [typesAnchorEl, setTypesAnchorEl] = useState<null | HTMLElement>(null)
  const [workItemTypes, setWorkItemTypes] = useState(initialItemTypes)
  const openTypesMenu = Boolean(typesAnchorEl)
  const handleTypesClick = (event: React.MouseEvent<HTMLElement>): void => setTypesAnchorEl(event.currentTarget)
  const handleTypesMenuClose = (): void => setTypesAnchorEl(null)
  const handleTypesCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newItemTypes = [...workItemTypes]
    const selectedTypes = newItemTypes.find((item) => item.key === event.target.name)
    if (selectedTypes !== undefined) selectedTypes.checked = event.target.checked
    setWorkItemTypes(newItemTypes)
  }
  // assigned to fiter control
  const [assignedAnchorEl, setAssignedAnchorEl] = useState<null | HTMLElement>(null)
  const [assignedTo, setAssignedTo] = useState(initialAssignedTo)
  const openAssignedMenu = Boolean(assignedAnchorEl)
  const handleAssignedClick = (event: React.MouseEvent<HTMLElement>): void => setAssignedAnchorEl(event.currentTarget)
  const handleAssignedMenuClose = (): void => setAssignedAnchorEl(null)
  const handleAssignedCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newAssignedTo = [...assignedTo]
    const selectedAssigned = newAssignedTo.find((item) => item.key === event.target.name)
    if (selectedAssigned !== undefined) selectedAssigned.checked = event.target.checked
    setAssignedTo(newAssignedTo)
  }
  // states filter control
  const [statesAnchorEl, setStatesAnchorEl] = useState<null | HTMLElement>(null)
  const [states, setStates] = useState(initialStates)
  const openStatesMenu = Boolean(statesAnchorEl)
  const handleStatesClick = (event: React.MouseEvent<HTMLElement>): void => setStatesAnchorEl(event.currentTarget)
  const handleStatesMenuClose = (): void => setStatesAnchorEl(null)
  const handleStatesCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newStates = [...states]
    const selectedStates = newStates.find((item) => item.key === event.target.name)
    if (selectedStates !== undefined) selectedStates.checked = event.target.checked
    setStates(newStates)
  }
  // area filter control
  const [areaAnchorEl, setAreaAnchorEl] = useState<null | HTMLElement>(null)
  const [area, setArea] = useState(initialArea)
  const openAreaMenu = Boolean(areaAnchorEl)
  const handleAreaClick = (event: React.MouseEvent<HTMLElement>): void => setAreaAnchorEl(event.currentTarget)
  const handleAreaMenuClose = (): void => setAreaAnchorEl(null)
  const handleAreaCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newArea = [...area]
    const selectedArea = newArea.find((item) => item.key === event.target.name)
    if (selectedArea !== undefined) selectedArea.checked = event.target.checked
    setArea(newArea)
  }
  // tags filter control
  const [tagsAnchorEl, setTagsAnchorEl] = useState<null | HTMLElement>(null)
  const [tags, setTags] = useState(initialTags)
  const openTagsMenu = Boolean(tagsAnchorEl)
  const handleTagsClick = (event: React.MouseEvent<HTMLElement>): void => setTagsAnchorEl(event.currentTarget)
  const handleTagsMenuClose = (): void => setTagsAnchorEl(null)
  const handleTagsCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newTags = [...tags]
    const selectedTags = newTags.find((item) => item.id === event.target.name)
    if (selectedTags !== undefined) selectedTags.checked = event.target.checked
    setTags(newTags)
  }
  // close fiters bar
  const [filtersBarShow, setFiltersBarShow] = useState(true)
  const handleCloseFitersBar = (): void => setFiltersBarShow(false)
  return (
    <Box sx={{
      padding: '1rem',
      '& .dataGrid--header': {
        fontSize: '.75rem'
      },
      '& .titleColumn--hover': {
        cursor: 'pointer',
        '&:hover': {
          color: blue[800],
          textDecoration: 'underline'
        }
      }
    }} >
      {/* title */}
      <Typography sx={{ marginLeft: '.5rem', fontSize: '1.125rem', fontWeight: 'light' }}>
        Work items
      </Typography>
      {/* option bar */}
      <ListOptionsBar />
      {/* filter bar */}
      {
        filtersBarShow && <Stack direction='row' sx={{ marginTop: '.5rem', paddingY: '.5rem', backgroundColor: grey[100], borderRadius: '3px' }}>
          {/* search */}
          <TextField
            type='text'
            placeholder='Filter by keyword'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <FilterAltOutlined sx={{ color: grey[500] }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-input': {
                height: '36.5px',
                paddingY: '0'
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none'
                },
                '&:hover fieldset': {
                  border: 'none'
                },
                '&.Mui-focused fieldset': {
                  border: 'none'
                }
              }
            }}
          />
          {/* types filter */}
          <Button
            id="types-button"
            sx={{
              marginLeft: 'auto',
              paddingX: '1rem',
              borderRadius: '2px',
              color: grey[600],
              '&:hover': {
                backgroundColor: grey[200],
                color: grey[600]
              },
              '&:active': {
                backgroundColor: grey[400],
                color: grey[900]
              }
            }}
            aria-controls={openTypesMenu ? 'types-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openTypesMenu ? 'true' : undefined}
            variant="text"
            disableElevation
            onClick={handleTypesClick}
            endIcon={<KeyboardArrowDown />}
          >
            Types
          </Button>
          <FilterMenu
            id="types-menu"
            MenuListProps={{
              'aria-labelledby': 'types-button'
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
          {/* assigned to filter */}
          <Button
            id="assigned-button"
            sx={{
              paddingX: '1rem',
              borderRadius: '2px',
              color: grey[600],
              '&:hover': {
                backgroundColor: grey[200],
                color: grey[600]
              },
              '&:active': {
                backgroundColor: grey[400],
                color: grey[900]
              }
            }}
            aria-controls={openAssignedMenu ? 'assigned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openAssignedMenu ? 'true' : undefined}
            variant="text"
            disableElevation
            onClick={handleAssignedClick}
            endIcon={<KeyboardArrowDown />}
          >
            Assigned To
          </Button>
          <FilterMenu
            id="assigned-menu"
            MenuListProps={{
              'aria-labelledby': 'assigned-button'
            }}
            anchorEl={assignedAnchorEl}
            open={openAssignedMenu}
            onClose={handleAssignedMenuClose}
          >
            {
              assignedTo.map((item) => {
                return (
                  <MenuItem component='label' key={item.key} disableRipple>
                    <Checkbox
                      sx={{ padding: 0 }}
                      name={item.key}
                      checked={item.checked}
                      onChange={handleAssignedCheck}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    {item.avatar}
                    <Typography sx={{
                      marginLeft: '.25rem',
                      fontWeight: 300,
                      fontSize: '.875rem',
                      color: grey[700]
                    }}>
                      {item.name}
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
          {/* states to filter */}
          <Button
            id="states-button"
            sx={{
              paddingX: '1rem',
              borderRadius: '2px',
              color: grey[600],
              '&:hover': {
                backgroundColor: grey[200],
                color: grey[600]
              },
              '&:active': {
                backgroundColor: grey[400],
                color: grey[900]
              }
            }}
            aria-controls={openStatesMenu ? 'states-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openStatesMenu ? 'true' : undefined}
            variant="text"
            disableElevation
            onClick={handleStatesClick}
            endIcon={<KeyboardArrowDown />}
          >
            States
          </Button>
          <FilterMenu
            id="states-menu"
            MenuListProps={{
              'aria-labelledby': 'states-button'
            }}
            anchorEl={statesAnchorEl}
            open={openStatesMenu}
            onClose={handleStatesMenuClose}
          >
            {
              states.map((item) => {
                return (
                  <MenuItem component='label' key={item.key} disableRipple>
                    <Checkbox
                      sx={{ padding: 0 }}
                      name={item.key}
                      checked={item.checked}
                      onChange={handleStatesCheck}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    {item.icon}
                    <Typography sx={{
                      marginLeft: '.25rem',
                      fontWeight: 300,
                      fontSize: '.875rem',
                      color: grey[700]
                    }}>
                      {item.name}
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
          {/* area to filter */}
          <Button
            id="area-button"
            sx={{
              paddingX: '1rem',
              borderRadius: '2px',
              color: grey[600],
              '&:hover': {
                backgroundColor: grey[200],
                color: grey[600]
              },
              '&:active': {
                backgroundColor: grey[400],
                color: grey[900]
              }
            }}
            aria-controls={openAreaMenu ? 'area-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openAreaMenu ? 'true' : undefined}
            variant="text"
            disableElevation
            onClick={handleAreaClick}
            endIcon={<KeyboardArrowDown />}
          >
            Area
          </Button>
          <FilterMenu
            id="area-menu"
            MenuListProps={{
              'aria-labelledby': 'area-button'
            }}
            anchorEl={areaAnchorEl}
            open={openAreaMenu}
            onClose={handleAreaMenuClose}
          >
            {
              area.map((item) => {
                return (
                  <MenuItem component='label' key={item.key} disableRipple>
                    <Checkbox
                      sx={{ padding: 0 }}
                      name={item.key}
                      checked={item.checked}
                      onChange={handleAreaCheck}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <Typography sx={{
                      marginLeft: '.25rem',
                      fontWeight: 300,
                      fontSize: '.875rem',
                      color: grey[700]
                    }}>
                      {item.name}
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
          {/* area to filter */}
          <Button
            id="tags-button"
            sx={{
              paddingX: '1rem',
              borderRadius: '2px',
              color: grey[600],
              '&:hover': {
                backgroundColor: grey[200],
                color: grey[600]
              },
              '&:active': {
                backgroundColor: grey[400],
                color: grey[900]
              }
            }}
            aria-controls={openTagsMenu ? 'area-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openTagsMenu ? 'true' : undefined}
            variant="text"
            disableElevation
            onClick={handleTagsClick}
            endIcon={<KeyboardArrowDown />}
          >
            Tags
          </Button>
          <FilterMenu
            id="tags-menu"
            MenuListProps={{
              'aria-labelledby': 'tags-button'
            }}
            anchorEl={tagsAnchorEl}
            open={openTagsMenu}
            onClose={handleTagsMenuClose}
          >
            <RadioGroup
              row
              aria-labelledby='tags-and-or-label'
              name='tags-and-or'
              sx={{ marginLeft: '1.125rem' }}
            >
              <FormControlLabel
                sx={{ marginRight: '2rem' }}
                value='or'
                control={<Radio size='small' />}
                label={<Typography variant='body2'>Or</Typography>} />
              <FormControlLabel
                value='and'
                control={<Radio size='small' /> }
                label={<Typography variant='body2'>And</Typography>} />
            </RadioGroup>
            {
              tags.map((item) => {
                return (
                  <MenuItem component='label' key={item.id} disableRipple>
                    <Checkbox
                      sx={{ padding: 0 }}
                      name={item.id}
                      checked={item.checked}
                      onChange={handleTagsCheck}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <Typography sx={{
                      marginLeft: '.25rem',
                      fontWeight: 300,
                      fontSize: '.875rem',
                      color: grey[700]
                    }}>
                      {item.name}
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
          {/* close bar */}
          <Tooltip title='Clear and dismiss filters' placement='bottom-end'>
            <IconButton sx={{ margin: 'auto .75rem' }} aria-label="closeFiltersBar" onClick={handleCloseFitersBar}>
              <Clear sx={{ color: grey[600], fontSize: 'medium' }} />
            </IconButton>
          </Tooltip>
        </Stack>
      }
      {/* table */}
      <div style={{ height: 400, width: '100%' }}>
        <CheckboxStyledDataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableColumnMenu
          components={{
            MoreActionsIcon: MoreHorizOutlined
          }}
        />
      </div>
    </Box>
  )
}
