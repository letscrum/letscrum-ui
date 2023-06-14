import React, { useContext } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, Select, DialogActions, Button, InputBase,
  ListSubheader, ListSubheaderProps, MenuItem, SelectChangeEvent
} from '@mui/material'
import { LocationOn } from '@mui/icons-material'
import { grey, blue } from '@mui/material/colors'
import styled from '@emotion/styled'
import { ExistedWorkContext } from '../../components/itemDetailPageTitle/ItemDetailPageTitle'

const AddLinkInput = styled(InputBase)({
  fontSize: '.875rem',
  color: grey[900],
  '& .MuiInputBase-input': {
    paddingLeft: '.25rem',
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
  const useExistedWorkContext = (): any => {
    const existedWorkContext = useContext(ExistedWorkContext)
    return existedWorkContext
  }
  const { existedWorkValue, setExistedWorkValue } = useExistedWorkContext()
  const handleExistedWorkValue = (e: SelectChangeEvent<string>): void => setExistedWorkValue(e.target.value)
  const selectItem = (item: string): JSX.Element => <MenuItem
    key={item} value={item} sx={{ fontSize: '.875rem' }}>
    {item}
  </MenuItem>

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
        <ExistedWorkSubheader>GitHub</ExistedWorkSubheader>
        {
          existedItem[0].links.map((item) => selectItem(item))
        }
        <ExistedWorkSubheader>Work</ExistedWorkSubheader>
        {
          existedItem[1].links.map((item) => selectItem(item))
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
