import React, { useState } from 'react'
import { Box, Grid, Stack, Typography, Divider, MenuItem, Button, Menu, MenuProps } from '@mui/material'
import { OpenInFull, KeyboardArrowDown, Add, Link, AssignmentTurnedInOutlined } from '@mui/icons-material'
import { blue, grey } from '@mui/material/colors'
// import styled from '@emotion/styled'
import { styled, alpha } from '@mui/material/styles'
import { ItemDetailPageAddExistItem } from '../itemDetailPageAddExistItem'

const DetailItemContainer = styled(Stack)({
  padding: '.875rem 0 .875rem 1.25rem'
})

const ItemTitleText = styled(Typography)({
  marginRight: 'auto',
  paddingBottom: '.25rem',
  fontWeight: '700'
})

const ItemTitleOption = styled(Stack)({
  display: 'flex',
  alignItems: 'center'
})

const ItemTitleContainer = styled(Stack)({
  '&:hover': {
    color: blue[700],
    cursor: 'pointer'
  }
})

const FullScreenIcon = styled(OpenInFull)({
  marginLeft: 'auto',
  width: '.875rem',
  height: '.875rem',
  color: grey[800],
  '&:hover': {
    color: blue[700],
    cursor: 'pointer'
  }
})

const AddLinkMenu = styled((props: MenuProps) => (
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
    borderRadius: '2px',
    marginTop: theme.spacing(1),
    minWidth: '10rem',
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      fontSize: '.875rem',
      '& .MuiSvgIcon-root': {
        fontSize: '1rem',
        color: theme.palette.text.secondary,
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

export const ItemDetailPageLink = (): JSX.Element => {
  const [anchorElAddLink, setAnchorElAddLink] = React.useState<null | HTMLElement>(null)
  const openAddLink = Boolean(anchorElAddLink)
  const [addRelatedDialog, setAddRelatedDialog] = useState(false)
  const handleCloseAddRelatedDialog = (): void => setAddRelatedDialog(false)
  const handleClickAddLink = (event: React.MouseEvent<HTMLElement>): void => setAnchorElAddLink(event.currentTarget)
  const handleCloseAddLink = (): void => setAnchorElAddLink(null)
  const handleShowAddRelatedDialog = (): void => {
    handleCloseAddLink()
    setAddRelatedDialog(true)
  }
  return <Box paddingRight='.5rem' height='21rem' sx={{ overflowY: 'auto' }}>
    {/* links title */}
    <Stack>
      <DetailItemContainer>
        <ItemTitleContainer direction='row' >
          <ItemTitleText>
            Links
          </ItemTitleText>
          <ItemTitleOption>
            <FullScreenIcon />
          </ItemTitleOption>
        </ItemTitleContainer>
        <Divider sx={{ marginBottom: '.25rem' }} />
      </DetailItemContainer>
    </Stack>
    {/* links */}
    <Grid container direction='column' sx={{ display: 'flex', alignItems: 'center' }}>
      <Link sx={{ width: '8rem', height: '8rem', color: grey[500] }} />
      <Typography sx={{ paddingBottom: '1rem', fontSize: '.875rem', color: grey[700] }}>
        No links have been added
      </Typography>
      <Button
        id="demo-customized-button"
        aria-controls={openAddLink ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openAddLink ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClickAddLink}
        startIcon={<Add />}
        endIcon={<KeyboardArrowDown />}
        sx={{ borderRadius: '0' }}
      >
        Add link
      </Button>
      <AddLinkMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button'
        }}
        anchorEl={anchorElAddLink}
        open={openAddLink}
        onClose={handleCloseAddLink}
      >
        <MenuItem onClick={handleShowAddRelatedDialog} disableRipple>
          <Link />
          Edit
        </MenuItem>
        <MenuItem onClick={handleCloseAddLink} disableRipple disabled>
          <AssignmentTurnedInOutlined />
          Duplicate
        </MenuItem>
      </AddLinkMenu>
      {/* add existing link dialog */}
      <ItemDetailPageAddExistItem
        addRelatedDialog={addRelatedDialog}
        handleCloseAddRelatedDialog={handleCloseAddRelatedDialog}
        />
    </Grid>
  </Box>
}
