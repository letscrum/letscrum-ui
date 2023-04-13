import React, { useState, MouseEvent } from 'react'
import { Box, Stack, MenuItem, Button, MenuProps, styled, Menu, alpha, IconButton, List, ListItem, ListItemText, Typography, Divider, Tooltip, Switch, FormControlLabel } from '@mui/material'
import {
  Add, KeyboardArrowDown, PestControl, BakeryDining, EmojiEvents, Park, ListAlt, CloseFullscreen,
  AssignmentTurnedIn, Science, Shortcut, BuildOutlined, VerticalAlignTopOutlined, DeleteOutlined, TuneOutlined, FilterAltOutlined, OpenInFullOutlined, FilterAlt
} from '@mui/icons-material'
import { amber, blue, deepOrange, deepPurple, grey, purple, red, teal } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'

interface FilterControllerType {
  projectId: string
  filteringTypes: boolean
  filteringAssigned: boolean
  filteringStates: boolean
  filteringArea: boolean
  filteringTags: boolean
  filtersBarShow: boolean
  handleCloseFitersBar: () => void
  hidden: boolean
  handleSwitchHiddenItems: () => void
}

const sortItems = [
  {
    title: 'Assigned to me',
    path: 'assignedtome'
  },
  {
    title: 'Following',
    path: 'following'
  },
  {
    title: 'Mentioned',
    path: 'mentioned'
  },
  {
    title: 'My activity',
    path: 'myactivity'
  },
  {
    title: 'Recently updated',
    path: 'recentlyupdated'
  },
  {
    title: 'Recently completed',
    path: 'recentlycompleted'
  },
  {
    title: 'Recently created',
    path: 'recentlycreated'
  }
]

const MenuOptionButton = styled(Button)({
  padding: '0 1rem',
  borderRadius: '0',
  '&:hover': { backgroundColor: grey[200] },
  '& .MuiButton-startIcon>*:nth-of-type(1)': { color: blue[900], fontSize: '1rem' },
  '& .MuiButton-endIcon>*:nth-of-type(1)': { color: grey[600], fontSize: '1rem' }
})

const OptionButton = styled(Button)({
  padding: '0 1rem',
  borderRadius: '0',
  '&:hover': { backgroundColor: grey[200] },
  '& .MuiButton-startIcon>*:nth-of-type(1)': { color: blue[900], fontSize: '1rem' }
})

const NewMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 3,
    marginTop: 0,
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
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

const CompletedItemsSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  marginLeft: '.75rem',
  marginRight: '.5rem',
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)'
    }
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200
    })
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box'
  }
}))

export const ListOptionsBar: React.FunctionComponent<FilterControllerType> = (props: FilterControllerType) => {
  const itemTypes = [{
    id: '1',
    title: 'Bug',
    icon: <PestControl sx={{ color: red[900], fontSize: 'small' }} />,
    path: `/${props.projectId}/_workitems/create/Bug`
  },
  {
    id: '2',
    title: 'Epic',
    icon: <BakeryDining sx={{ color: deepOrange[500], fontSize: 'small' }} />,
    path: `/${props.projectId}/_workitems/create/Epic`
  },
  {
    id: '3',
    title: 'Feature',
    icon: <EmojiEvents sx={{ color: deepPurple[900], fontSize: 'small' }} />,
    path: `/${props.projectId}/_workitems/create/Feature`
  },
  {
    id: '4',
    title: 'Impediment',
    icon: <Park sx={{ color: purple[500], fontSize: 'small' }} />,
    path: `/${props.projectId}/_workitems/create/Impediment`
  },
  {
    id: '5',
    title: 'Product Backlog Item',
    icon: <ListAlt sx={{ color: blue[700], fontSize: 'small' }} />,
    path: `/${props.projectId}/_workitems/create/Backlog`
  },
  {
    id: '6',
    title: 'Task',
    icon: <AssignmentTurnedIn sx={{ color: amber[900], fontSize: 'small' }} />,
    path: `/${props.projectId}/_workitems/create/Task`
  },
  {
    id: '7',
    title: 'Test Case',
    icon: <Science sx={{ color: teal[700], fontSize: 'small' }} />,
    path: `/${props.projectId}/_workitems/create/Test`
  }]
  const navigate = useNavigate()
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedSortIndex, setSelectedSortIndex] = useState(4)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openNew = Boolean(anchorEl)
  const openSort = Boolean(sortAnchorEl)
  const handleItemSort = (e: MouseEvent<HTMLElement>): void => setSortAnchorEl(e.currentTarget)
  const handleSortMenuItemClick = (
    itemPath: string,
    e: MouseEvent<HTMLElement>,
    index: number
  ): void => {
    setSelectedSortIndex(index)
    setSortAnchorEl(null)
    navigate(itemPath)
  }
  const handleClickNewButton = (e: MouseEvent<HTMLElement>): void => setAnchorEl(e.currentTarget)
  const handleCreateItem = (e: MouseEvent<HTMLElement>, itemPath: string): void => {
    navigate(itemPath)
  }
  const handleCloseNewMenu = (): void => setAnchorEl(null)
  const handleCloseSortMenu = (): void => setSortAnchorEl(null)
  const [viewOptionsAnchorEl, setViewOptionsAnchorEl] = React.useState<null | HTMLElement>(null)
  const openViewOptions = Boolean(viewOptionsAnchorEl)
  const handleOpenViewOptions = (event: React.MouseEvent<HTMLButtonElement>): void => setViewOptionsAnchorEl(event.currentTarget)
  const handleViewOptionsClose = (): void => setViewOptionsAnchorEl(null)
  const [fullScreen, setFullScreen] = useState(false)
  const handleFullScreen = (): void => setFullScreen(!fullScreen)
  return (
    <Box width='100%'>
      <Stack direction='row' sx={{ margin: '1rem .5rem .125rem .5rem', paddingBottom: '.5rem' }}>
        <List
          component="nav"
          aria-label="Device settings"
          sx={{ bgcolor: 'background.paper' }}
        >
          <ListItem
            sx={{ padding: '0 .5rem', cursor: 'pointer' }}
            aria-haspopup="listbox"
            aria-controls="sort-menu"
            aria-expanded={openSort ? 'true' : undefined}
            onClick={handleItemSort}
          >
            <ListItemText
              secondary={sortItems[selectedSortIndex].title}
              sx={{ marginRight: '.25rem', width: 'auto', '& .MuiTypography-root': { color: grey[700], fontWeight: 'bold', fontSize: '.875rem' } }}
            />
            <KeyboardArrowDown sx={{ fontWeight: 300, color: grey[600] }} />
          </ListItem>
        </List>
        <Menu
          id="sort-menu"
          anchorEl={sortAnchorEl}
          open={openSort}
          onClose={handleCloseSortMenu}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox'
          }}
        >
          {sortItems.map((item, index) => (
            <MenuItem
              sx={{ fontSize: '.875rem', fontWeight: 300, color: grey[900] }}
              key={item.title}
              selected={index === selectedSortIndex}
              onClick={(event) => handleSortMenuItemClick(item.path, event, index)}
            >
              {item.title}
            </MenuItem>
          ))}
        </Menu>
        <Divider sx={{ marginX: '.5rem', marginY: '.875rem' }} orientation='vertical' variant='middle' flexItem />
        <MenuOptionButton
          aria-controls={openNew ? 'new-work-item' : undefined}
          aria-haspopup='true'
          aria-expanded={openNew ? 'true' : undefined}
          variant='text'
          onClick={handleClickNewButton}
          startIcon={<Add fontSize='small' />}
          endIcon={<KeyboardArrowDown />}
        >
          <Typography variant='body2' color={grey[700]}>
            New Work Item
          </Typography>
        </MenuOptionButton>
        <NewMenu
          MenuListProps={{
            'aria-labelledby': 'new-work-item'
          }}
          anchorEl={anchorEl}
          open={openNew}
          onClose={handleCloseNewMenu}
        >
          {itemTypes.map((item) => {
            return (
              <MenuItem
                sx={{
                  fontWeight: 300,
                  fontSize: '.875rem',
                  color: grey[700]
                }}
                key={item.id}
                onClick={(e) => handleCreateItem(e, item.path)}
                disableRipple
              >
                {item.icon}
                {item.title}
              </MenuItem>
            )
          })}
        </NewMenu>
        <OptionButton
          variant='text'
          startIcon={<Shortcut fontSize='small' />}
        >
          <Typography variant='body2' color={grey[700]}>
            Open in Queries
          </Typography>
        </OptionButton>
        <OptionButton
          variant='text'
          startIcon={<BuildOutlined fontSize='small' />}
        >
          <Typography variant='body2' color={grey[700]}>
            Column Options
          </Typography>
        </OptionButton>
        <OptionButton
          variant='text'
          startIcon={<VerticalAlignTopOutlined />}
        >
          <Typography variant='body2' color={grey[700]}>
            Import Work Items
          </Typography>
        </OptionButton>
        <OptionButton
          variant='text'
          startIcon={<DeleteOutlined fontSize='small' />}
        >
          <Typography variant='body2' color={grey[700]}>
            Recycle Bin
          </Typography>
        </OptionButton>
        <Tooltip title='View options'>
          <>
            <IconButton
              sx={{ marginLeft: 'auto', marginY: 'auto', borderRadius: 0 }}
              id='viewOptions'
              aria-controls={openViewOptions ? 'viewOptions-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openViewOptions ? 'true' : undefined}
              onClick={handleOpenViewOptions}
            >
              <TuneOutlined sx={{ color: blue[900], fontSize: '1rem' }} />
            </IconButton>
            <Menu
              id='viewOptions-menu'
              sx={{
                '& .MuiList-padding': {
                  width: '12rem',
                  padding: '.875rem .5rem'
                }
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              anchorEl={viewOptionsAnchorEl}
              open={openViewOptions}
              onClose={handleViewOptionsClose}
              MenuListProps={{
                'aria-labelledby': 'viewOptions'
              }}
            >
              <Typography sx={{ fontSize: '.75rem', fontWeight: 'light', color: grey[500] }}>Completed Work Items</Typography>
              <FormControlLabel
                control={<CompletedItemsSwitch defaultChecked onChange={props.handleSwitchHiddenItems}/>}
                label={
                  props.hidden
                    ? <Typography sx={{ fontSize: '.75rem', color: grey[700] }}>Hidden</Typography>
                    : <Typography sx={{ fontSize: '.75rem', color: grey[700] }}>Shown</Typography>
                }
                />
            </Menu>
          </>
        </Tooltip>
        <Tooltip title='Hide filters'>
          <IconButton sx={{ marginY: 'auto', borderRadius: 0 }} onClick={props.handleCloseFitersBar}>
            {(
              (Boolean(props.filteringTypes)) ||
              (Boolean(props.filteringAssigned)) ||
              (Boolean(props.filteringStates)) ||
              (Boolean(props.filteringArea)) ||
              (Boolean(props.filteringTags))
            )
              ? <FilterAlt sx={{ color: blue[900], fontSize: '1rem' }} />
              : <FilterAltOutlined sx={{ color: blue[900], fontSize: '1rem' }} />
            }
          </IconButton>
        </Tooltip>
        <Tooltip title='Enter full screen mode'>
          <IconButton sx={{ marginY: 'auto', borderRadius: 0 }} onClick={handleFullScreen}>
            {
              fullScreen
                ? <CloseFullscreen sx={{ color: blue[900], fontSize: '1rem' }} />
                : <OpenInFullOutlined sx={{ color: blue[900], fontSize: '1rem' }} />
            }
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider />
    </Box>
  )
}
