import React, { useState, MouseEvent } from 'react'
import { Box, Stack, MenuItem, Button, MenuProps, styled, Menu, alpha, IconButton, List, ListItem, ListItemText, Typography, Divider } from '@mui/material'
import {
  Add, KeyboardArrowDown, PestControl, BakeryDining, EmojiEvents, Park, ListAlt,
  AssignmentTurnedIn, Science, Shortcut, BuildOutlined, VerticalAlignTopOutlined, DeleteOutlined, TuneOutlined, FilterAltOutlined, OpenInFullOutlined
} from '@mui/icons-material'
import { amber, blue, deepOrange, deepPurple, grey, purple, red, teal } from '@mui/material/colors'

const sortItems = [
  'Assigned to me',
  'Following',
  'Mentioned',
  'My activity',
  'Recently updated',
  'Recently completed',
  'Recently created'
]

const itemTypes = [{
  id: '1',
  title: 'Bug',
  icon: <PestControl sx={{ color: red[900], fontSize: 'small' }} />,
  path: '/'
},
{
  id: '2',
  title: 'Epic',
  icon: <BakeryDining sx={{ color: deepOrange[500], fontSize: 'small' }} />,
  path: '/'
},
{
  id: '3',
  title: 'Feature',
  icon: <EmojiEvents sx={{ color: deepPurple[900], fontSize: 'small' }} />,
  path: '/'
},
{
  id: '4',
  title: 'Impediment',
  icon: <Park sx={{ color: purple[500], fontSize: 'small' }} />,
  path: '/'
},
{
  id: '5',
  title: 'Product Backlog Item',
  icon: <ListAlt sx={{ color: blue[700], fontSize: 'small' }} />,
  path: '/'
},
{
  id: '6',
  title: 'Task',
  icon: <AssignmentTurnedIn sx={{ color: amber[900], fontSize: 'small' }} />,
  path: '/'
},
{
  id: '7',
  title: 'Test Case',
  icon: <Science sx={{ color: teal[700], fontSize: 'small' }} />,
  path: '/'
}]

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

export const ListOptionsBar: React.FunctionComponent = () => {
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedSortIndex, setSelectedSortIndex] = useState(4)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openNew = Boolean(anchorEl)
  const openSort = Boolean(sortAnchorEl)
  const handleItemSort = (e: MouseEvent<HTMLElement>): void => setSortAnchorEl(e.currentTarget)
  const handleSortMenuItemClick = (
    e: MouseEvent<HTMLElement>,
    index: number
  ): void => {
    setSelectedSortIndex(index)
    setSortAnchorEl(null)
    console.log('index: ', index)
    console.log('seletedSortIndex: ', selectedSortIndex)
  }
  const handleClickNewButton = (e: MouseEvent<HTMLElement>): void => setAnchorEl(e.currentTarget)
  const handleCloseNewMenu = (): void => setAnchorEl(null)
  const handleCloseSortMenu = (): void => setSortAnchorEl(null)
  return (
    <Box>
      <Stack direction='row' sx={{ margin: '.875rem .5rem .125rem .5rem' }}>
        <List
          component="nav"
          aria-label="Device settings"
          sx={{ bgcolor: 'background.paper' }}
        >
          <ListItem
            sx={{ padding: '0 .5rem' }}
            aria-haspopup="listbox"
            aria-controls="sort-menu"
            aria-expanded={openSort ? 'true' : undefined}
            onClick={handleItemSort}
          >
            <ListItemText
              // primary='Recently updated'
              secondary={sortItems[selectedSortIndex]}
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
              key={item}
              selected={index === selectedSortIndex}
              onClick={(event) => handleSortMenuItemClick(event, index)}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>
        <Divider sx={{ marginX: '.5rem', marginY: '.875rem' }} orientation='vertical' variant='middle' flexItem />
        <Button
          sx={{
            padding: '0 1rem',
            borderRadius: '0',
            '& .MuiButton-startIcon>*:nth-of-type(1)': { color: blue[900], fontSize: '1rem' },
            '& .MuiButton-endIcon>*:nth-of-type(1)': { color: grey[600], fontSize: '1rem' }
          }}
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
        </Button>
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
                onClick={handleCloseNewMenu}
                disableRipple
              >
                {item.icon}
                {item.title}
              </MenuItem>
            )
          })}
        </NewMenu>
        <Button
          sx={{
            padding: '0 1rem',
            borderRadius: '0',
            '& .MuiButton-startIcon>*:nth-of-type(1)': { color: blue[900], fontSize: '1rem' }
          }}
          variant='text'
          startIcon={<Shortcut fontSize='small' />}
        >
          <Typography variant='body2' color={grey[700]}>
            Open in Queries
          </Typography>
        </Button>
        <Button
          sx={{
            padding: '0 1rem',
            borderRadius: '0',
            '& .MuiButton-startIcon>*:nth-of-type(1)': { color: blue[900], fontSize: '1rem' }
          }}
          variant='text'
          startIcon={<BuildOutlined fontSize='small' />}
        >
          <Typography variant='body2' color={grey[700]}>
            Column Options
          </Typography>
        </Button>
        <Button
          sx={{
            padding: '0 1rem',
            borderRadius: '0',
            '& .MuiButton-startIcon>*:nth-of-type(1)': { color: blue[900], fontSize: '1rem' }
          }}
          variant='text'
          startIcon={<VerticalAlignTopOutlined />}
        >
          <Typography variant='body2' color={grey[700]}>
            Import Work Items
          </Typography>
        </Button>
        <Button
          sx={{
            padding: '0 1rem',
            borderRadius: '0',
            '& .MuiButton-startIcon>*:nth-of-type(1)': { color: blue[900], fontSize: '1rem' }
          }}
          variant='text'
          startIcon={<DeleteOutlined fontSize='small' />}
        >
          <Typography variant='body2' color={grey[700]}>
            Recycle Bin
          </Typography>
        </Button>
        <IconButton sx={{ marginLeft: '1rem' }}>
          <TuneOutlined sx={{ color: blue[900], fontSize: '1rem' }} />
        </IconButton>
        <IconButton>
          <FilterAltOutlined sx={{ color: blue[900], fontSize: '1rem' }} />
        </IconButton>
        <IconButton>
          <OpenInFullOutlined sx={{ color: blue[900], fontSize: '1rem' }} />
        </IconButton>
      </Stack>
      <Divider />
    </Box>
  )
}
