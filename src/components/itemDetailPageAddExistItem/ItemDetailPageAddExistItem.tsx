import React, { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, Select, DialogActions, Button, InputBase,
  SelectChangeEvent, ListSubheader, ListSubheaderProps, MenuItem
} from '@mui/material'
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

const existedItem = [
  {
    groupName: 'GitHub',
    links: ['GitHub Issue']
  },
  {
    groupName: 'Work',
    links: [
      'Child',
      'Duplicate',
      'Duplicate Of',
      'Parent',
      'Predecessor',
      'Related',
      'Successor',
      'Tested By',
      'Tests'
    ]
  },
  {
    groupName: 'GitHub',
    links: ['GitHub Commit', 'GitHub Pull Request']
  }
]

const ExistedWorkSubheader = (props: ListSubheaderProps): JSX.Element => <ListSubheader
  {...props}
  sx={{ color: blue[800], fontSize: '.875rem', borderBottom: `1px solid ${grey[200]}` }}
/>

ExistedWorkSubheader.muiSkipListHighlight = true
export default ExistedWorkSubheader

export const ItemDetailPageAddExistItem = (
  props: {
    addRelatedDialog: boolean
    handleCloseAddRelatedDialog: () => void
  }
): JSX.Element => {
  const addRelatedDialog = props.addRelatedDialog
  const handleCloseAddRelatedDialog = props.handleCloseAddRelatedDialog
  const [existedWorkValue, setExistedWorkValue] = useState('Child')
  const handleExistedWorkValue = (e: SelectChangeEvent<string>): void => setExistedWorkValue(e.target.value)

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
        value={existedWorkValue}
        onChange={handleExistedWorkValue}
        input={<AddLinkInput />}
      >
        {
          existedItem.map((item, index) =>
            <>
              <ExistedWorkSubheader key={index}>
                {item.groupName}
              </ExistedWorkSubheader>
              {
                item.links.map((item, index) =>
                  <MenuItem key={index} sx={{ fontSize: '.875rem' }}>
                    {item}
                  </MenuItem>
                )
              }
            </>
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
