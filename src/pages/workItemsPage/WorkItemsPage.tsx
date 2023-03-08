import React, { ChangeEvent, useState, useEffect } from 'react'
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
import { selectUserName } from '../../redux/reducers/userSlice'
import { useAppSelector } from '../../redux/hooks'

interface RowsProps {
  id: number
  type: string
  title: string
  assign: string
  state: string
  area: string
  tags: string
  comments: string
  activity: Date
}
interface TypesProps {
  id: string
  key: string
  title: string
  icon: any
  path: string
  checked: boolean
}
const initialItemTypes: TypesProps[] = [
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
interface AssignedToProps {
  key: string
  name: string
  avatar: any
  checked: boolean
}

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

const initialRows: RowsProps[] = [
  { id: 1, type: 'bug', title: 'Shoveling Snow', assign: 'Jon', state: 'open', area: 'Canada', tags: 'Tags', comments: 'Comments', activity: randomUpdatedDate() },
  { id: 2, type: 'epic', title: 'Snowing day', assign: 'Will', state: 'open', area: 'China', tags: 'Cold', comments: 'beautiful', activity: randomUpdatedDate() },
  { id: 3, type: 'test', title: 'Padding', assign: 'Anna', state: 'To Do', area: 'Canada', tags: 'Summer', comments: 'Comments', activity: randomUpdatedDate() },
  { id: 4, type: 'bug', title: 'Swimming', assign: 'Chris', state: 'open', area: 'iMoogoo', tags: 'Sports', comments: 'Working hard', activity: randomUpdatedDate() },
  { id: 5, type: 'task', title: 'Cooking', assign: 'Lynn', state: 'open', area: 'Home', tags: 'Delicious', comments: 'Yummy', activity: randomUpdatedDate() },
  { id: 6, type: 'feature', title: 'Skiing', assign: 'admin', state: 'To Do', area: 'Canada', tags: 'Sports', comments: 'Working hard', activity: randomUpdatedDate() },
  { id: 7, type: 'impediment', title: 'Painting', assign: '', state: 'To Do', area: 'Canada', tags: 'Artic', comments: 'Gift', activity: randomUpdatedDate() }
]

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
          switch (params.value) {
            case 'bug': return <PestControl sx={{ color: red[900], fontSize: 'small' }} />
            case 'epic': return <BakeryDining sx={{ color: deepOrange[500], fontSize: 'small' }} />
            case 'feature': return <EmojiEvents sx={{ color: deepPurple[900], fontSize: 'small' }} />
            case 'impediment': return <Park sx={{ color: purple[500], fontSize: 'small' }} />
            case 'backlog': return <ListAlt sx={{ color: blue[700], fontSize: 'small' }} />
            case 'task': return <AssignmentTurnedIn sx={{ color: amber[900], fontSize: 'small' }} />
            case 'test': return <Science sx={{ color: teal[700], fontSize: 'small' }} />
          }
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
  const [rows, setRows] = useState(initialRows)
  // keyword search
  const [keyword, setKeyword] = useState<string>('')
  const getKeyword = (e: ChangeEvent<HTMLInputElement>): void => setKeyword(e.currentTarget.value)
  const handleSearch = (): void => {
    if (keyword === '' || keyword === undefined || keyword === null) setRows(initialRows)
    const newRows = initialRows.filter((item) => item.title.includes(keyword))
    setRows(newRows)
  }
  // submit search by stop typing
  useEffect(() => {
    const delayDebounce = setTimeout(handleSearch, 500)
    return () => clearTimeout(delayDebounce)
  }, [keyword])
  // filter options
  const allAssignedTo = initialRows.map((item) => item.assign)
  const allStates = initialRows.map((item) => item.state)
  const allArea = initialRows.map((item) => item.area)
  const allTags = initialRows.map((item) => item.tags)
  const firstLetter = (name: string): string => {
    return name.charAt(0).toUpperCase()
  }
  const deduplication = (allOptions: any): any => {
    for (let i = 0; i < allOptions.length; i++) {
      for (let j = i + 1; j < allOptions.length; j++) {
        if (allOptions[j] === allOptions[i]) {
          allOptions.splice(j, 1)
          j--
        }
      }
    }
    return allOptions
  }
  const dynamicStates = deduplication(allStates)
  const dynamicArea = deduplication(allArea)
  const dynamicTags = deduplication(allTags)
  console.log('dynamicStates: ', dynamicStates, 'dynamicArea: ', dynamicArea, 'dynamicTags: ', dynamicTags)
  // types filter control
  const allTypes = initialRows.map((item) => item.type)
  const dynamicTypes = (): TypesProps[] => {
    let newTypes: TypesProps[] = []
    deduplication(allTypes).forEach((type: string) => {
      newTypes = newTypes.concat(initialItemTypes.filter((item) => item.key === type))
    })
    return newTypes
  }
  const itemTypes = dynamicTypes()
  const [workItemTypes, setWorkItemTypes] = useState(itemTypes)
  const [filteringTypes, setFilteringTypes] = useState(false)
  const [typesAnchorEl, setTypesAnchorEl] = useState<null | HTMLElement>(null)
  const openTypesMenu = Boolean(typesAnchorEl)
  const handleTypesClick = (event: React.MouseEvent<HTMLElement>): void => setTypesAnchorEl(event.currentTarget)
  const handleTypesMenuClose = (): void => setTypesAnchorEl(null)
  const handleTypesCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newItemTypes = [...workItemTypes]
    // every check click
    const selectedTypes = newItemTypes.find((item) => item.key === event.target.name)
    if (selectedTypes !== undefined) {
      // modify selected types checked value
      selectedTypes.checked = event.target.checked
      setFilteringTypes(true)
    }
    // all checked types
    const allSelectedTypes = newItemTypes.filter((item) => item.checked)
    // cancel all checked
    if (allSelectedTypes.length === 0) {
      setFilteringTypes(false)
      setRows(initialRows)
    } else {
      // update rows which include any selected types
      let newRows: RowsProps[] = []
      allSelectedTypes.forEach((i) => {
        newRows = newRows.concat(initialRows.filter((item) => item.type.includes(i.key)))
      })
      setRows(newRows)
    }
    setWorkItemTypes(newItemTypes)
  }
  const handleClearCheckedTypes = (): void => {
    const newItemTypes = [...workItemTypes]
    newItemTypes.forEach((item): void => { item.checked = false })
    setWorkItemTypes(newItemTypes)
    setFilteringTypes(false)
  }
  // assigned to fiter control
  const displayName = useAppSelector(selectUserName) ?? ''
  const defaultAssignedTo: AssignedToProps[] = [
    {
      key: displayName,
      name: '@me',
      avatar: null,
      checked: false
    },
    {
      key: '',
      name: 'Unassigned',
      avatar: null,
      checked: false
    }
  ]
  const dynamicAssignedTo = deduplication(allAssignedTo)
  const assignTo = (item: string): AssignedToProps => {
    const assignItem = {
      key: item,
      name: item,
      avatar: <Avatar sx={{ width: 16, height: 16 }}>
        <Typography sx={{ fontSize: '.5rem' }}>
          {firstLetter(item)}
        </Typography>
      </Avatar>,
      checked: false
    }
    return assignItem
  }
  const dynamicAssignedToObjArray = dynamicAssignedTo.map((item: string) => assignTo(item))
  // if concat, there will be 2 item with the same key
  const initialAssignedTo = defaultAssignedTo.concat(dynamicAssignedToObjArray)
  const [assignedTo, setAssignedTo] = useState(initialAssignedTo)
  const [filteringAssigned, setFilteringAssigned] = useState(false)
  const [assignedAnchorEl, setAssignedAnchorEl] = useState<null | HTMLElement>(null)
  const openAssignedMenu = Boolean(assignedAnchorEl)
  const handleAssignedClick = (event: React.MouseEvent<HTMLElement>): void => setAssignedAnchorEl(event.currentTarget)
  const handleAssignedMenuClose = (): void => setAssignedAnchorEl(null)
  const handleAssignedCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newAssignedTo = [...assignedTo]
    // every check click
    const selectedAssigned = newAssignedTo.find((item) => item.key === event.target.name)
    if (selectedAssigned !== undefined) {
      // modify selected types checked value
      selectedAssigned.checked = event.target.checked
      setFilteringTypes(true)
    }
    // all checked types
    const allSelectedAssigned = newAssignedTo.filter((item) => item.checked)
    // cancel all checked
    if (allSelectedAssigned.length === 0) {
      setFilteringTypes(false)
      setRows(initialRows)
    } else {
      // update rows which include any selected types
      let newRows: RowsProps[] = []
      allSelectedAssigned.forEach((i) => {
        // ??? unassigned and assign to me need to be completed
        newRows = newRows.concat(initialRows.filter((item) => {
          if (i.key === '') {
            return item.assign === ''
          } else {
            return item.assign.includes(i.key)
          }
        }
        ))
      })
      setRows(newRows)
    }
    setAssignedTo(newAssignedTo)
  }
  const handleClearCheckedAssigned = (): void => {
    const newAssignedTo = [...assignedTo]
    newAssignedTo.forEach((item): void => { item.checked = false })
    setAssignedTo(newAssignedTo)
    setFilteringAssigned(false)
  }
  // states filter control
  const [filteringStates, setFilteringStates] = useState(false)
  const [statesAnchorEl, setStatesAnchorEl] = useState<null | HTMLElement>(null)
  const [states, setStates] = useState(initialStates)
  const openStatesMenu = Boolean(statesAnchorEl)
  const handleStatesClick = (event: React.MouseEvent<HTMLElement>): void => setStatesAnchorEl(event.currentTarget)
  const handleStatesMenuClose = (): void => setStatesAnchorEl(null)
  const handleStatesCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newStates = [...states]
    const selectedStates = newStates.find((item) => item.key === event.target.name)
    if (selectedStates !== undefined) {
      setFilteringStates(true)
      selectedStates.checked = event.target.checked
    }
    const canceledStates = newStates.filter((item) => item.checked)
    if (canceledStates.length === 0) setFilteringStates(false)
    setStates(newStates)
  }
  const handleClearCheckedStates = (): void => {
    const newStates = [...states]
    newStates.forEach((item): void => { item.checked = false })
    setStates(newStates)
    setFilteringStates(false)
  }
  // area filter control
  const [filteringArea, setFilteringArea] = useState(false)
  const [areaAnchorEl, setAreaAnchorEl] = useState<null | HTMLElement>(null)
  const [area, setArea] = useState(initialArea)
  const openAreaMenu = Boolean(areaAnchorEl)
  const handleAreaClick = (event: React.MouseEvent<HTMLElement>): void => setAreaAnchorEl(event.currentTarget)
  const handleAreaMenuClose = (): void => setAreaAnchorEl(null)
  const handleAreaCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newArea = [...area]
    const selectedArea = newArea.find((item) => item.key === event.target.name)
    if (selectedArea !== undefined) {
      setFilteringArea(true)
      selectedArea.checked = event.target.checked
    }
    const canceledArea = newArea.filter((item) => item.checked)
    if (canceledArea.length === 0) setFilteringArea(false)
    setArea(newArea)
  }
  const handleClearCheckedArea = (): void => {
    const newArea = [...area]
    newArea.forEach((item): void => { item.checked = false })
    setArea(newArea)
    setFilteringArea(false)
  }
  // tags filter control
  const [filteringTags, setFilteringTags] = useState(false)
  const [tagsAnchorEl, setTagsAnchorEl] = useState<null | HTMLElement>(null)
  const [tags, setTags] = useState(initialTags)
  const openTagsMenu = Boolean(tagsAnchorEl)
  const handleTagsClick = (event: React.MouseEvent<HTMLElement>): void => setTagsAnchorEl(event.currentTarget)
  const handleTagsMenuClose = (): void => setTagsAnchorEl(null)
  const handleTagsCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newTags = [...tags]
    const selectedTags = newTags.find((item) => item.id === event.target.name)
    if (selectedTags !== undefined) {
      setFilteringTags(true)
      selectedTags.checked = event.target.checked
    }
    const canceledTags = newTags.filter((item) => item.checked)
    if (canceledTags.length === 0) setFilteringTags(false)
    setTags(newTags)
  }
  const handleClearCheckedTags = (): void => {
    const newTags = [...tags]
    newTags.forEach((item): void => { item.checked = false })
    setTags(newTags)
    setFilteringTags(false)
  }
  // close filters bar
  const [filtersBarShow, setFiltersBarShow] = useState(true)
  const handleCloseFitersBar = (): void => setFiltersBarShow(!filtersBarShow)
  return (
    <Box sx={{
      width: '100%',
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
      <ListOptionsBar
        filteringTypes={filteringTypes}
        filteringAssigned={filteringAssigned}
        filteringStates={filteringStates}
        filteringArea={filteringArea}
        filteringTags={filteringTags}
        filtersBarShow={filtersBarShow}
        handleCloseFitersBar={handleCloseFitersBar}
      />
      {/* filter bar */}
      {
        filtersBarShow &&
        <Stack direction='row' sx={{ marginTop: '.5rem', paddingY: '.5rem', backgroundColor: grey[100], borderRadius: '3px' }}>
          {/* keyword search */}
          {
            keyword === ''
              // with input keyword
              ? <Tooltip title='Filter by keyword'>
                <TextField
                  type='search'
                  placeholder='Filter by keyword'
                  value={keyword}
                  onChange={getKeyword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <FilterAltOutlined sx={{ color: grey[700] }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    marginLeft: '.5rem',
                    '& ::placeholder': {
                      fontSize: '.875rem'
                    },
                    '& .MuiOutlinedInput-input': {
                      height: '36.5px',
                      paddingY: '0',
                      paddingLeft: '.315rem'
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
              </Tooltip>
              // input keyword
              : <Tooltip title='Filter by keyword'>
                <TextField
                  type='search'
                  placeholder='Filter by keyword'
                  value={keyword}
                  onChange={getKeyword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <FilterAltOutlined sx={{ color: grey[700] }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    marginLeft: '.5rem',
                    '& ::placeholder': {
                      fontSize: '.875rem'
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize: '.875rem',
                      height: '36.5px',
                      paddingY: '0',
                      paddingLeft: '.315rem'
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderRadius: '2px',
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: grey[700],
                        boxShadow: '0 0 0 2px #bbdefb'
                      }
                    }
                  }}
                />
              </Tooltip>
          }
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
              <Button
                sx={{ marginLeft: 'auto' }}
                variant='text'
                startIcon={<Clear />}
                onClick={handleClearCheckedTypes}
              >
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
              <Button
                variant='text'
                sx={{ marginLeft: 'auto' }}
                startIcon={<Clear />}
                onClick={handleClearCheckedAssigned}
              >
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
              <Button
                variant='text'
                sx={{ marginLeft: 'auto' }}
                startIcon={<Clear />}
                onClick={handleClearCheckedStates}
              >
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
              <Button
                variant='text'
                sx={{ marginLeft: 'auto' }}
                startIcon={<Clear />}
                onClick={handleClearCheckedArea}
              >
                Clear
              </Button>
            </Stack>
          </FilterMenu>
          {/* tags to filter */}
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
                checked
                control={<Radio size='small' />}
                label={<Typography sx={{
                  marginLeft: '.25rem',
                  fontWeight: 300,
                  fontSize: '.875rem',
                  color: grey[700]
                }}>Or</Typography>} />
              <FormControlLabel
                value='and'
                control={<Radio size='small' />}
                label={<Typography sx={{
                  marginLeft: '.25rem',
                  fontWeight: 300,
                  fontSize: '.875rem',
                  color: grey[700]
                }}>And</Typography>} />
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
              <Button
                variant='text'
                sx={{ marginLeft: 'auto' }}
                startIcon={<Clear />}
                onClick={handleClearCheckedTags}
              >
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
