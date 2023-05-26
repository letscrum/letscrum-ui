import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, Select, DialogActions, Button, InputBase } from '@mui/material'
import { LocationOn } from '@mui/icons-material'
import { grey, blue } from '@mui/material/colors'
import styled from '@emotion/styled'

const AddLinkInput = styled(InputBase)({
  '& .MuiInputBase-input': {
    borderRadius: '0',
    border: `1px solid ${grey[500]}`
  }
})

const AddLinkDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    padding: '0 1rem 1rem 0',
    height: '80vh',
    borderRadius: '0'
  }
})

const CancelButton = styled(Button)({
  padding: '.315rem 1.25rem',
  borderRadius: '0',
  fontWeight: '600',
  color: grey[900],
  backgroundColor: grey[100],
  '&:hover': {
    backgroundColor: grey[200]
  },
  '&:active': {
    color: 'white',
    backgroundColor: blue[900]
  }
})

const developmentLink = [
  {
    groupName: 'Build',
    links: ['Build', 'Found in build', 'Integrated in build']
  },
  {
    groupName: 'Code',
    links: ['Branch', 'Changeset', 'Commit', 'Pull Request', 'Versioned Item']
  },
  {
    groupName: 'GitHub',
    links: ['GitHub Commit', 'GitHub Pull Request']
  }
]

export const ItemDetailPageAddExistItem = (
  props: {
    addRelatedDialog: boolean
    handleCloseAddRelatedDialog: () => void
  }
): JSX.Element => {
  const addRelatedDialog = props.addRelatedDialog
  const handleCloseAddRelatedDialog = props.handleCloseAddRelatedDialog
  return <AddLinkDialog
  sx={{ '& .MuiPaper-root': { width: '120rem' } }}
  open={addRelatedDialog}
  onClose={handleCloseAddRelatedDialog}
>
  <DialogTitle fontWeight='light'>
    Add link
  </DialogTitle>
  <DialogContent>
    <DialogContentText sx={{ fontSize: '.875rem', fontWeight: '400', color: grey[900] }}>
      You are adding a link from:
    </DialogContentText>
    <LocationOn sx={{ marginTop: '.5rem', width: '1.25rem', height: '1.25rem', color: blue[900] }} />
    <DialogContentText sx={{ marginY: '.5rem', fontSize: '.875rem', fontWeight: 'light' }}>
      Link type
    </DialogContentText>
    <Select
      fullWidth
      input={<AddLinkInput />}
    >
      {
        developmentLink.map((item, index) =>
          <optgroup key={index} label={item.groupName}>
            {
              item.links.map((item, index) =>
                <option key={index}>
                  {item}
                </option>
              )
            }
          </optgroup>
        )
      }
    </Select>
  </DialogContent>
  <DialogActions>
    <Button
      disabled
      sx={{ color: grey[300] }}
      onClick={handleCloseAddRelatedDialog}
    >
      OK
    </Button>
    <CancelButton
      onClick={handleCloseAddRelatedDialog}
    >
      Cancel
    </CancelButton>
  </DialogActions>
</AddLinkDialog>
}
