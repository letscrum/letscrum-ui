import React, { useState } from 'react'
import { Box, Grid, Button, IconButton, Link, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, FormControl, RadioGroup, Radio, Typography, FormControlLabel, Select, MenuItem } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { Close, Language, Lock, ExpandMore } from '@mui/icons-material'
import { grey, red } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import { Stack } from '@mui/system'

const CreateDialog = styled(Dialog)({
  '& .MuiDialog-container': {
    justifyContent: 'end'
  }
})
const CreateTitle = styled(DialogTitle)({
  '& .MuiDialogTitle-root': {
    fontWeight: '700',
    color: grey[900]
  }
})
const ContentWrapper = styled(DialogContent)({
  padding: '.5rem 1.5rem'
})
const InputLabel = styled(DialogContentText)({
  color: grey[700],
  fontSize: '.875rem'
})
const InputBar = styled(TextField)({
  '& .MuiInputBase-root': {
    padding: 1
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: 2,
      borderColor: grey[700]
    },
    '&:focused fieldset': {
      borderWidth: 1,
      borderColor: grey[700],
      boxShadow: '0 0 15px -2px #444444'
    },
    '& .Mui-focused fieldset': {
      borderWidth: 5,
      borderColor: grey[700],
      boxShadow: '0 0 15px -2px #444444'
    }
  }
})
// const RadioWrapper = styled(Grid)({
//   display: 'flex',
//   marginLeft: '.5rem',
//   width: '16rem',
//   backgroundColor: grey[100],
//   justifyContent: 'between'
// })
const RadioContentWrapper = styled(Stack)({
  padding: '1rem'
})
export const CreateProject = (props: { show: boolean, handleClose: () => void }): React.ReactElement => {
  const show = props.show
  const [visibility, setVisibility] = useState('private')
  const [versionController, setVersionController] = useState('git')
  const handleClose = props.handleClose
  const handleRadio = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => setVisibility(e.currentTarget.id)
  const handleController = (e: SelectChangeEvent): void => setVersionController(e.target.value)
  return (
    <Box>
      {show &&
        <CreateDialog open={show} onClose={handleClose}>
          <Stack direction='row'>
            <CreateTitle>Subscribe</CreateTitle>
            <IconButton sx={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }} onClick={handleClose} >
              <Close />
            </IconButton>
          </Stack>
          <ContentWrapper>
            <InputLabel>
              Project name
              <span style={{ color: red[500] }}>*</span>
            </InputLabel>
            <InputBar
              autoFocus
              margin="dense"
              id="name"
              size='small'
              type="text"
              fullWidth
              variant="outlined"
            />
          </ContentWrapper>
          <ContentWrapper>
            <InputLabel>
              Description
            </InputLabel>
            <InputBar
              autoFocus
              margin="dense"
              id="name"
              size='small'
              type="text"
              fullWidth
              variant="outlined"
            />
          </ContentWrapper>
          <ContentWrapper>
            <InputLabel>
              Visibility
            </InputLabel>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={visibility}
              >
                <Grid
                  component='label'
                  id='public'
                  sx={{ display: 'flex', width: '16rem', backgroundColor: grey[200], justifyContent: 'between' }}
                  onClick={handleRadio}
                >
                  <RadioContentWrapper width='50%'>
                    <Language sx={{ color: grey[700], fontSize: '1rem' }} />
                    <Typography variant='body2' sx={{ marginTop: '.5rem', color: grey[700] }}>
                      Public
                    </Typography>
                    <Typography variant='caption' sx={{ marginTop: '.5rem', color: grey[700] }}>
                      Anyone on the internet can view the project. Certain features like TFVC are not supported.
                    </Typography>
                  </RadioContentWrapper>
                  <FormControlLabel
                    value='public'
                    control={
                      <Radio sx={{ '& .MuiSvgIcon-root': { fontSize: '1rem' } }} />
                    }
                    label=''
                    sx={{ display: 'flex', alignItems: 'start', marginLeft: 'auto', marginRight: 0 }}
                  />
                </Grid>
                <Grid
                  component='label'
                  id='private'
                  sx={{ display: 'flex', marginLeft: '.5rem', width: '16rem', backgroundColor: grey[200], justifyContent: 'between' }}
                  onClick={handleRadio}
                >
                  <RadioContentWrapper width='50%'>
                    <Lock sx={{ color: grey[700], fontSize: '1rem' }} />
                    <Typography variant='body2' sx={{ marginTop: '.5rem', color: grey[700] }}>
                      Private
                    </Typography>
                    <Typography variant='caption' sx={{ marginTop: '.5rem', color: grey[700] }}>
                      Only people you give access to will be able to view this project.
                    </Typography>
                  </RadioContentWrapper>
                  <FormControlLabel
                    value='private'
                    control={
                      <Radio sx={{ '& .MuiSvgIcon-root': { fontSize: '1rem' } }} />
                    }
                    label=''
                    sx={{ display: 'flex', alignItems: 'start', marginLeft: 'auto', marginRight: 0 }}
                  />
                </Grid>
              </RadioGroup>
            </FormControl>
          </ContentWrapper>
          <Typography variant='body2' sx={{ padding: '.5rem 1.5rem', color: grey[700], fontWeight: 'regular' }}>
            By creating this project, you agree to the Azure DevOps <Link>code of conduct</Link>
          </Typography>
          <Button disableElevation variant='contained' sx={{ margin: '.5rem 1.5rem', padding: '.25rem auto', borderRadius: '2', backgroundColor: grey[200] }}>
            <ExpandMore sx={{ color: grey[700] }} />
            <Typography color={grey[700]} fontWeight='bold' fontSize='.875rem' >
              Advanced
            </Typography>
          </Button>
          <ContentWrapper>
            <InputLabel>
              Version control
            </InputLabel>
            <Select
              sx={{
                width: '50%',
                fontSize: '.75rem',
                borderRadius: '2px',
                '& .MuiInputBase-root': {
                  '& .MuiOutlinedInput-root': {
                    borderColor: red[100]
                  }
                },
                '& .MuiSelect-outlined': {
                  borderColor: red[100]
                },
                '& .MuiSelect-select': {
                  padding: '.5rem'
                }
              }}
              defaultValue='git'
              value={versionController}
              onChange={handleController}
            >
              <MenuItem value='git' sx={{ fontSize: '.75rem' }}>Git</MenuItem>
              <MenuItem value='team'>Team Foundation Version Control</MenuItem>
            </Select>
          </ContentWrapper>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Subscribe</Button>
          </DialogActions>
        </CreateDialog>
      }
    </Box>
  )
}
