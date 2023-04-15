import React, { useState } from 'react'
import { Grid, Divider, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { KeyboardReturnOutlined } from '@mui/icons-material'
import { grey, blue, lightBlue } from '@mui/material/colors'
import styled from '@emotion/styled'

const BackButton = styled(Button)({
  borderRadius: '0',
  '&:hover': { backgroundColor: grey[200] }
})

const LeaveConfirmDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    borderRadius: '0'
  }
})

const LeaveButton = styled(Button)({
  width: '6.25rem',
  borderRadius: '0',
  backgroundColor: blue[800],
  color: 'white',
  '&:hover': {
    width: '6.25rem',
    backgroundColor: lightBlue[900],
    fontWeight: 'lighter'
  },
  '&:active': {
    color: 'white',
    backgroundColor: blue[800]
  }
})

const StayButton = styled(Button)({
  width: '6.25rem',
  borderRadius: '0',
  background: grey[100],
  color: grey[900],
  '&:hover': {
    width: '6.25rem',
    backgroundColor: grey[300],
    fontWeight: 'lighter'
  },
  '&:active': {
    color: 'white',
    backgroundColor: blue[800]
  }
})

export const ItemDetailPageHeader: React.FunctionComponent = () => {
  const [openCloseConfirm, setOpenCloseConfirm] = useState<boolean>(false)
  const handleOpenConfirm = (): void => setOpenCloseConfirm(true)
  const handleCloseConfirm = (): void => setOpenCloseConfirm(false)
  return <Stack direction='row' padding='1.5rem 1.75rem'>
    <Grid sx={{ height: '2.25rem' }}>
      <Typography sx={{ paddingRight: '1.75rem', lineHeight: '2.25rem', fontSize: '1.125rem', fontWeight: 'light', color: grey[800] }}>
        Work Items
      </Typography>
    </Grid>
    <Divider orientation="vertical" variant="middle" flexItem color={ grey[200] } />
    <Grid sx={{ paddingLeft: '.5rem' }}>
      <BackButton onClick={handleOpenConfirm} startIcon={<KeyboardReturnOutlined sx={{ paddingLeft: '.5rem', color: blue[900] }} />}>
        <Typography sx={{ paddingLeft: '.25rem', fontSize: '.875rem', color: grey[800] }}>
          Back to Work Items
        </Typography>
      </BackButton>
      <LeaveConfirmDialog
        open={openCloseConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to leave the page'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You have unsaved changes:
            $ default name
            You can leave to discard your changes, or cancel to continue editing.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ paddingRight: '1rem', paddingBottom: '1rem' }}>
          <LeaveButton variant='text' onClick={handleCloseConfirm}>Leave</LeaveButton>
          <StayButton variant='text' onClick={handleCloseConfirm} autoFocus>
            Cancel
          </StayButton>
        </DialogActions>
      </LeaveConfirmDialog>
    </Grid>
  </Stack>
}
