import React, { useState } from 'react'
import { Box, Grid, Button, IconButton, Link, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, FormControl, RadioGroup, Radio, Typography, FormControlLabel, Select, MenuItem, Tooltip, tooltipClasses, TooltipProps, AlertProps } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import MuiAlert from '@mui/material/Alert'
import { Close, Language, Lock, ExpandMore, ExpandLess, HelpOutline, Check } from '@mui/icons-material'
import { grey, red, blue, green } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import { Stack } from '@mui/system'
import axios from 'axios'

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
  padding: '.5rem 1.5rem',
  overflowY: 'visible'
})
const InputLabel = styled(DialogContentText)({
  color: grey[700],
  fontSize: '.875rem'
})
const InputBar = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: 2,
      borderColor: grey[700]
    },
    '&.Mui-focused fieldset': {
      borderWidth: 1,
      boxShadow: '0 0 0 2px #bbdefb'
    }
  }
})
const CheckIcon = styled(Check)({
  fontSize: '1rem',
  color: green[500]
})
const RadioContentWrapper = styled(Stack)({
  padding: '1rem'
})
const ConductText = styled(Typography)({
  padding: '.5rem 1.5rem',
  color: grey[700],
  fontWeight: 'regular'
})
const AdvancedButton = styled(Button)({
  margin: '.5rem 1.5rem',
  padding: '.25rem auto',
  borderRadius: '2',
  backgroundColor: grey[200],
  '&:hover': {
    backgroundColor: grey[200]
  }
})
const AdvancedHelpIcon = styled(HelpOutline)({
  marginLeft: '.25rem',
  fontSize: '1rem',
  fontWeight: 'light',
  color: blue[700]
})
const HelpTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({
  [`& .${tooltipClasses.tooltip}`]: {
    margin: '1rem',
    backgroundColor: grey[900],
    fontSize: '.875rem',
    color: 'white',
    lineHeight: '1.25rem',
    borderRadius: '2px'
  }
}))
const MenuProps = {
  PaperProps: {
    style: {
      borderRadius: '2px'
    }
  }
}
const SelectItem = styled(MenuItem)({
  fontSize: '.75rem'
})
const CancelButton = styled(Button)({
  padding: '.25rem .5rem',
  color: grey[900],
  backgroundColor: grey[100],
  borderRadius: '2px',
  border: 'none',
  '&:hover': {
    backgroundColor: grey[300]
  }
})
const CreateButton = styled(Button)({
  marginLeft: '.125rem',
  padding: '.25rem .5rem',
  backgroundColor: blue[700],
  color: 'white',
  borderRadius: '2px',
  border: 'none',
  '&:hover': {
    backgroundColor: blue[800]
  }
})
// const SelectBar = styled(Select)({}})
export const CreateProject = (props: { show: boolean, handleClose: () => void }): React.ReactElement => {
  const show = props.show
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState('private')
  const [hoverId, setHoverId] = useState('')
  const [versionController, setVersionController] = useState('git')
  const [workItemProcess, setWorkItemProcess] = useState('agile')
  const [showMore, setShowMore] = useState(false)
  const handleClose = (): void => {
    props.handleClose()
    setProjectName('')
    setVisibility('private')
    setVersionController('git')
    setWorkItemProcess('agile')
  }
  const handleProjectName = (e: React.ChangeEvent<HTMLInputElement>): void => setProjectName(e.currentTarget.value)
  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>): void => setDescription(e.currentTarget.value)
  const handleMouseIn = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>): void => setHoverId(e.currentTarget.id)
  const handleMouseOut = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>): void => {
    visibility === e.currentTarget.id ||
      setHoverId('')
  }
  const handleRadio = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    setVisibility(e.currentTarget.id)
    setHoverId(e.currentTarget.id)
  }
  const handleMore = (): void => setShowMore(!showMore)
  const handleController = (e: SelectChangeEvent): void => setVersionController(e.target.value)
  const handleProcess = (e: SelectChangeEvent): void => setWorkItemProcess(e.target.value)
  const addProject = (): void => {
    setLoading(true)
    try {
      void axios.post('v1/projects', {
        displayName: projectName,
        description
      })
      setLoading(false)
      handleClose()
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert (
    props,
    ref
  ): React.ReactElement {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  })
  return (
    <Box component='form' noValidate>
      {show &&
        <CreateDialog open={show} onClose={handleClose}>
          {loading && <>loading</>}
          {/* title */}
          <Stack direction='row'>
            <CreateTitle>Subscribe</CreateTitle>
            <Grid sx={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }}>
              <IconButton onClick={handleClose} >
                <Close />
              </IconButton>
            </Grid>
          </Stack>
          {/* project name */}
          {(error !== '') && <Alert severity="error">{error}</Alert>}
          <ContentWrapper>
            <InputLabel>
              Project name
              <span style={{ color: red[500] }}>*</span>
            </InputLabel>
            <InputBar
              autoFocus
              required
              margin="dense"
              size='small'
              type="text"
              fullWidth
              variant="outlined"
              onChange={handleProjectName}
            />
            {(Boolean(projectName)) && <CheckIcon />}
          </ContentWrapper>
          {/* decription */}
          <ContentWrapper>
            <InputLabel>
              Description
            </InputLabel>
            <InputBar
              autoFocus
              margin="dense"
              size='small'
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              onChange={handleDescription}
            />
            {(Boolean(description)) && <CheckIcon />}
          </ContentWrapper>
          {/* visibility */}
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
                  sx={{
                    display: 'flex',
                    width: '16rem',
                    backgroundColor: grey[200],
                    justifyContent: 'between',
                    borderRadius: '2px',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: grey[200],
                    cursor: 'pointer',
                    '&:hover': {
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: grey[400]
                    }
                  }}
                  onClick={handleRadio}
                  onMouseEnter={handleMouseIn}
                  onMouseLeave={handleMouseOut}
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
                  {
                    (hoverId === 'public' || visibility === 'public') &&
                    <FormControlLabel
                      value='public'
                      control={
                        <Radio sx={{ '& .MuiSvgIcon-root': { fontSize: '1rem' } }} />
                      }
                      label=''
                      sx={{ display: 'flex', alignItems: 'start', marginLeft: 'auto', marginRight: 0 }}
                    />
                  }
                </Grid>
                <Grid
                  component='label'
                  id='private'
                  sx={{
                    display: 'flex',
                    width: '16rem',
                    marginLeft: '.5rem',
                    backgroundColor: grey[200],
                    justifyContent: 'between',
                    borderRadius: '2px',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: grey[200],
                    cursor: 'pointer',
                    '&:hover': {
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: grey[400]
                    }
                  }}
                  onClick={handleRadio}
                  onMouseEnter={handleMouseIn}
                  onMouseLeave={handleMouseOut}
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
                  {
                    (hoverId === 'private' || visibility === 'private') &&
                    <FormControlLabel
                      value='private'
                      control={
                        <Radio sx={{ '& .MuiSvgIcon-root': { fontSize: '1rem' } }} />
                      }
                      label=''
                      sx={{ display: 'flex', alignItems: 'start', marginLeft: 'auto', marginRight: 0 }}
                    />
                  }
                </Grid>
              </RadioGroup>
            </FormControl>
          </ContentWrapper>
          {/* code of conduct */}
          {
            visibility === 'public' &&
            <ConductText variant='body2'>
              By creating this project, you agree to the Azure DevOps <Link>code of conduct</Link>
            </ConductText>
          }
          {/* advanced button */}
          <AdvancedButton disableElevation variant='contained' onClick={handleMore}>
            {showMore
              ? <ExpandLess sx={{ color: grey[700] }} />
              : <ExpandMore sx={{ color: grey[700] }} />}
            <Typography color={grey[700]} fontWeight='bold' fontSize='.875rem' >
              Advanced
            </Typography>
          </AdvancedButton>
          {/* advanced options */}
          {showMore &&
            <ContentWrapper>
              <Stack direction='row'>
                <Grid sx={{ width: '16rem' }}>
                  <InputLabel>
                    Version control
                    <HelpTooltip
                      title='Compare and choose the right version control for your project.'
                      placement='top'
                    >
                      <AdvancedHelpIcon />
                    </HelpTooltip>
                  </InputLabel>
                  <Select
                    sx={{
                      width: '100%',
                      fontSize: '.75rem',
                      borderRadius: '2px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: grey[900]
                      },
                      '& .MuiSelect-select': {
                        padding: '.5rem'
                      }
                    }}
                    defaultValue='git'
                    MenuProps={MenuProps}
                    value={versionController}
                    onChange={handleController}
                  >
                    <SelectItem value='git'>
                      Git</SelectItem>
                    <SelectItem value='team'>
                      Team Foundation Version Control</SelectItem>
                  </Select>
                </Grid>
                <Grid sx={{ marginLeft: '.5rem', width: '16rem' }}>
                  <InputLabel>
                    Work item process
                    <HelpTooltip
                      title='Select the right work item process to create a team project.'
                      placement='top'
                    >
                      <AdvancedHelpIcon />
                    </HelpTooltip>
                  </InputLabel>
                  <Select
                    sx={{
                      width: '100%',
                      fontSize: '.75rem',
                      borderRadius: '2px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: grey[900]
                      },
                      '& .MuiSelect-select': {
                        padding: '.5rem'
                      }
                    }}
                    defaultValue='agile'
                    value={workItemProcess}
                    onChange={handleProcess}
                  >
                    <SelectItem value='agile'>Agile</SelectItem>
                    <SelectItem value='basic'>Basic</SelectItem>
                    <SelectItem value='cmmi'>CMMI</SelectItem>
                    <SelectItem value='scrum'>Scrum</SelectItem>
                  </Select>
                </Grid>
              </Stack>
            </ContentWrapper>
          }
          <DialogActions sx={{ padding: '2rem 1rem 1rem 1rem' }}>
            <CancelButton onClick={handleClose}>
              Cancel</CancelButton>
            {
              projectName !== ''
                ? <CreateButton onClick={addProject}>
                  Create</CreateButton>
                : <CancelButton disabled>
                  Create</CancelButton>
            }
          </DialogActions>
        </CreateDialog>
      }
    </Box>
  )
}
