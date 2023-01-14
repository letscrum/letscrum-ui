import React, { useState } from 'react'
import {
  Box, Stack, Avatar, Typography, Button, IconButton, Divider, Grid, Paper, Link, Chip, FormControl, Select, MenuItem, SelectChangeEvent,
  Dialog, DialogTitle, AlertProps, DialogContent, DialogContentText, TextField, RadioGroup, Radio, FormControlLabel, DialogActions
} from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { StarOutline, Lock, GroupAdd, TrendingUp, Edit, Assignment, AssignmentTurnedIn, Commit, Close, Add, Clear } from '@mui/icons-material'
import { grey, red, blue } from '@mui/material/colors'
import styled from '@emotion/styled'

const HeaderWrapper = styled(Stack)({
  position: 'sticky',
  zIndex: 1,
  top: 'calc(3rem + 1px)',
  padding: '1rem',
  backgroundColor: 'white'
})
const TitleText = styled(Typography)({
  lineHeight: '40px',
  marginLeft: '.5rem'
})
const PrivateButton = styled(Button)({
  marginLeft: 'auto',
  height: '2rem',
  backgroundColor: grey[100],
  color: grey[900],
  borderRadius: '2px',
  '&:hover': {
    backgroundColor: grey[200]
  }
})
const InviteButton = styled(Button)({
  marginLeft: '.5rem',
  height: '2rem',
  color: 'white',
  borderRadius: '2px'
})
const HeaderButtonText = styled(Typography)({
  marginLeft: '.5rem',
  fontSize: '.875rem'
})
const HeaderDivider = styled(Divider)({
  position: 'sticky',
  top: 'calc(7.5rem + 1px)',
  margin: 'auto',
  width: '98%'
})
const MainWrapper = styled(Box)({
  flexGrow: 1,
  backgroundColor: grey[100],
  padding: '1rem'
})
const ContentWrapper = styled(Paper)({
  padding: '2rem'
})
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
const WelcomeNavButton = styled(Button)({
  margin: '.5rem',
  height: '2rem',
  backgroundColor: grey[100],
  color: grey[900],
  borderRadius: '2px',
  '&:hover': {
    backgroundColor: grey[200]
  }
})
const ButtonText = styled(Typography)({
  marginLeft: '.5rem',
  color: grey[900],
  fontSize: '.875rem',
  fontWeight: '600'
})
const FavoriteButton = styled(IconButton)({
  marginLeft: '.5rem',
  height: '2rem',
  width: '2rem',
  '&:hover': {
    borderRadius: '2px'
  }
})
const AboutEditButton = styled(IconButton)({
  marginLeft: 'auto',
  height: '2rem',
  width: '2rem',
  '&:hover': {
    borderRadius: '2px'
  }
})
const EditDialog = styled(Dialog)({
  '& .MuiDialog-container': {
    justifyContent: 'end'
  }
})
const DialogContentWrapper = styled(DialogContent)({
  width: '32.5rem',
  padding: '1rem 1.5rem',
  overflowY: 'visible',
  overflowX: 'visible'
})
const EditTitle = styled(DialogTitle)({
  fontWeight: 'bold',
  color: grey[900]
})
const InputLabel = styled(DialogContentText)({
  color: grey[900],
  fontWeight: 'bold',
  fontSize: '1rem'
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
const AddTagsButton = styled(Button)({
  height: '1.5rem',
  backgroundColor: 'rgb(239, 246, 252)',
  fontSize: '.6125rem',
  color: grey[500],
  borderRadius: '2px',
  '&:hover': {
    backgroundColor: blue[50]
  },
  '&:active': {
    color: 'white',
    backgroundColor: blue[500]
  }
})
const AddTagsIconButton = styled(Button)({
  height: '1.5rem',
  width: '1.5rem',
  padding: '0',
  marginLeft: '.5rem',
  backgroundColor: 'rgb(239, 246, 252)',
  borderRadius: '0',
  minWidth: '0',
  '&:hover': {
    backgroundColor: blue[50]
  },
  '&:active': {
    color: 'white',
    backgroundColor: blue[500]
  },
  '& .MuiButton-startIcon': {
    margin: '0'
  },
  '& .MuiSvgIcon-root': {
    color: grey[600],
    fontSize: '1rem'
  }
})
const AddTagsInput = styled(TextField)({
  backgroundColor: 'rgb(239, 246, 252)',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: 0,
      borderColor: grey[500]
    },
    '&:hover fieldset': {
      borderColor: grey[500]
    },
    '&.Mui-focused fieldset': {
      borderWidth: 1,
      borderColor: grey[500]
    }
  },
  '& .MuiInputBase-input': {
    width: '12.5rem',
    height: '1.5rem',
    padding: '0 2px',
    fontSize: '.6125rem',
    fontWeight: '300',
    color: grey[900]
  }
})
const TagChip = styled(Chip)({
  height: '1.5rem',
  borderRadius: 0,
  padding: '2px',
  backgroundColor: 'rgb(239, 246, 252)',
  color: grey[600],
  '& .MuiChip-label': {
    padding: '0',
    marginLeft: '.5rem',
    marginRight: '.5rem'
  },
  '& .MuiSvgIcon-root': {
    margin: '0'
  },
  '& .MuiChip-deleteIcon': {
    color: grey[600],
    fontSize: '1rem'
  }
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
const StyledFormControlLabel = styled((props: FormControlLabelProps) => (
  <FormControlLabel {...props} />
))({
  '.MuiFormControlLabel-label': {
    fontSize: '.875rem'
  }
})
// eslint-disable-next-line @typescript-eslint/space-before-function-paren
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
): React.ReactElement {
  return <MuiAlert sx={{ margin: '.25rem' }} elevation={6} ref={ref} variant="filled" {...props} />
})
const EmptyReadme: React.FunctionComponent = () => {
  return (
    <div style={{ padding: '1rem', backgroundColor: 'rgb(249, 235, 235)' }}>
      <Typography variant='body2' sx={{ color: red[600], marginBottom: '.5rem' }}>We could not find Readme.md</Typography>
      <Typography variant='body2'>Seems like the file has not been created or was deleted.</Typography>
    </div>
  )
}
export const ProjectSummaryPage: React.FunctionComponent = () => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [description, setDescription] = useState('')
  const [fileType, setFileType] = useState<'readme' | 'wiki'>('readme')
  const [period, setPeriod] = useState('7')
  console.log('console---', setLoading, setError, setFileType)
  const handlePeriod = (e: SelectChangeEvent): void => setPeriod(e.target.value)
  const handleShow = (): void => setShow(true)
  const handleClose = (): void => setShow(false)
  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>): void => setDescription(e.currentTarget.value)
  const editProject = (): void => { }
  const handleTagsDelete = (): void => { }
  return (
    <Box width='100%'>
      {/* detail page */}
      <Box width='calc(100wh - 16rem - 1px)'>
        {/* header */}
        <HeaderWrapper direction='row'>
          <Avatar variant='rounded'>T</Avatar>
          <TitleText variant='h6' >test create project</TitleText>
          <PrivateButton variant='contained' size='small' disableElevation >
            <Lock sx={{ fontSize: '1rem' }} />
            <HeaderButtonText>Private</HeaderButtonText>
          </PrivateButton>
          <InviteButton variant='contained' size='small' disableElevation>
            <GroupAdd sx={{ fontSize: '1rem' }} />
            <HeaderButtonText>Invite</HeaderButtonText>
          </InviteButton>
          <FavoriteButton>
            <StarOutline sx={{ fontSize: '1rem', color: 'brown' }} />
          </FavoriteButton>
        </HeaderWrapper>
        <HeaderDivider />
        {/* main content */}
        <MainWrapper>
          <Grid container spacing={2}>
            <Grid item md={12} lg={8} >
              {/* empty about */}
              <ContentWrapper>
                <Grid container sx={{ flexDirection: 'column', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                  <img src='project_overview_day_zero.IG7Dq6.png' alt='project_overview' style={{ width: '20rem' }} />
                  <Typography variant='h4' sx={{ marginTop: '2rem', fontWeight: 'bold' }}>
                    Welcome to the project!
                  </Typography>
                  <Typography variant='body2'>
                    What service would you like to start with?
                  </Typography>
                  <Grid container sx={{ display: 'flex', marginTop: '1rem', justifyContent: 'center', alignItems: 'center' }}>
                    <WelcomeNavButton variant='contained' size='small' disableElevation>
                      <ButtonText>
                        Boards
                      </ButtonText>
                    </WelcomeNavButton>
                    <WelcomeNavButton variant='contained' size='small' disableElevation>
                      <ButtonText>
                        Repos
                      </ButtonText>
                    </WelcomeNavButton>
                    <WelcomeNavButton variant='contained' size='small' disableElevation>
                      <ButtonText>
                        Pipelines
                      </ButtonText>
                    </WelcomeNavButton>
                    <WelcomeNavButton variant='contained' size='small' disableElevation>
                      <ButtonText>
                        Test Plans
                      </ButtonText>
                    </WelcomeNavButton>
                    <WelcomeNavButton variant='contained' size='small' disableElevation>
                      <ButtonText>
                        Artifacts
                      </ButtonText>
                    </WelcomeNavButton>
                  </Grid>
                  <Link sx={{ marginTop: '1rem', textDecoration: 'none', cursor: 'pointer' }}>or manage your services</Link>
                </Grid>
              </ContentWrapper>
              {/* about */}
              <ContentWrapper>
                <Stack direction='row' >
                  <Typography variant='h6' fontWeight='bold'>About this project</Typography>
                  <AboutEditButton onClick={handleShow}>
                    <Edit sx={{ fontSize: '1rem' }} />
                  </AboutEditButton>
                </Stack>
                <Typography variant='body2' sx={{ marginTop: '2rem', marginBottom: '1rem' }}>Project description</Typography>
                <EmptyReadme />
                {/* <div style={{ padding: '1rem', backgroundColor: 'rgb(249, 235, 235)' }}>
                  <Typography variant='body2' sx={{ color: red[600], marginBottom: '.5rem' }}>We could not find Readme.md</Typography>
                  <Typography variant='body2'>Seems like the file has not been created or was deleted.</Typography>
                </div> */}
              </ContentWrapper>
            </Grid>
            <Grid item md={12} lg={4}>
              <ContentWrapper>
                {/* empty stats */}
                <Typography variant='h6' fontWeight='bold'>Project stats</Typography>
                <Grid container sx={{ flexDirection: 'column', my: '4rem', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '5rem', height: '5rem', backgroundColor: grey[100], borderRadius: '50%' }}>
                    <TrendingUp />
                  </div>
                  <Typography variant='body2' fontWeight='bold' marginTop='3rem'>No stats are available at this moment</Typography>
                  <Typography variant='body2' marginTop='1rem'>Setup a service to see project activity.</Typography>
                </Grid>
              </ContentWrapper>
              {/* stats */}
              <ContentWrapper>
                <Stack direction='row'>
                  <Typography variant='h6' fontWeight='bold'>Project stats</Typography>
                  {/* periods filter */}
                  <FormControl sx={{ ml: 'auto' }} size='small' >
                    <Select
                      value={period}
                      onChange={handlePeriod}
                      MenuProps={MenuProps}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      sx={{
                        width: '8rem',
                        backgroundColor: grey[200],
                        borderRadius: '2px',
                        fontSize: '.875rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: grey[200]
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: grey[200]
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: grey[200]
                        }
                      }}
                    >
                      <SelectItem value={'1'}>Last 1 day</SelectItem>
                      <SelectItem value={'7'}>Last 7 days</SelectItem>
                      <SelectItem value={'30'}>Last 30 day</SelectItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container>
                    <Grid item xs={12} paddingY='1rem'>
                      <Typography>Boards</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack direction='row' sx={{ display: 'flex', height: '4rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', marginRight: '1rem', width: '2rem', height: '2rem', justifyContent: 'center', alignItems: 'center', backgroundColor: grey[100], borderRadius: '2px' }}>
                          <Assignment sx={{ fontSize: '1rem' }} />
                        </div>
                        <Grid item xs={8}>
                          <Typography sx={{ fontSize: '.75rem' }}>0</Typography>
                          <Typography sx={{ fontSize: '.75rem' }}>Work items created</Typography>
                        </Grid>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack direction='row' sx={{ display: 'flex', height: '4rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', marginRight: '1rem', width: '2rem', height: '2rem', justifyContent: 'center', alignItems: 'center', backgroundColor: grey[100], borderRadius: '2px' }}>
                          <AssignmentTurnedIn sx={{ fontSize: '1rem' }} />
                        </div>
                        <Grid item xs={8}>
                          <Typography sx={{ fontSize: '.75rem' }}>0</Typography>
                          <Typography sx={{ fontSize: '.75rem' }}>Work items completed</Typography>
                        </Grid>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} paddingY='1rem'>
                    <Typography>Repos</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction='row' sx={{ display: 'flex', height: '4rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', marginRight: '1rem', width: '2rem', height: '2rem', justifyContent: 'center', alignItems: 'center', backgroundColor: grey[100], borderRadius: '2px' }}>
                        <Commit sx={{ fontSize: '1rem' }} />
                      </div>
                      <Grid item xs={8}>
                        <Typography sx={{ fontSize: '.75rem' }}>0</Typography>
                        <Typography sx={{ fontSize: '.75rem' }}>Changesets by 0 authors</Typography>
                      </Grid>
                    </Stack>
                  </Grid>
                </Box>
              </ContentWrapper>
              {/* members */}
              <ContentWrapper sx={{ marginTop: '1rem' }}>
                <Stack direction='row'>
                  <Typography variant='h6' fontWeight='bold'>Members</Typography>
                  <Chip size='small' sx={{ marginTop: '.125rem', marginLeft: '.25rem', px: '.25rem', backgroundColor: grey[100] }} label='1' />
                </Stack>
                <Grid container>
                  <Avatar sx={{ width: '1.875rem', height: '1.875rem', marginTop: '1rem' }}>
                    <Typography variant='body2' color='white'>L</Typography></Avatar>
                </Grid>
              </ContentWrapper>
            </Grid>
          </Grid>
        </MainWrapper >
      </Box >
      {/* edit about pop */}
      <Box component='form' noValidate>
        {show &&
          <EditDialog open={show} onClose={handleClose}>
            {loading && <>loading</>}
            {/* title */}
            <Stack direction='row'>
              <EditTitle>About this project</EditTitle>
              <Grid sx={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }}>
                <IconButton onClick={handleClose} >
                  <Close />
                </IconButton>
              </Grid>
            </Stack>
            {/* decription */}
            {(error !== '') && <Alert severity="error">{error}</Alert>}
            <DialogContentWrapper>
              <InputLabel>
                Description
              </InputLabel>
              <InputBar
                autoFocus
                required
                margin="dense"
                size='small'
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleDescription}
                value={description}
              />
            </DialogContentWrapper>
            {/* tags */}
            <DialogContentWrapper>
              <InputLabel>
                Tags
              </InputLabel>
              <AddTagsButton>Add tags</AddTagsButton>
              <AddTagsInput />
              <TagChip label='input value' onDelete={handleTagsDelete} deleteIcon={<Clear />} />
              <AddTagsIconButton startIcon={<Add />}/>
            </DialogContentWrapper>
            {/* about */}
            <DialogContentWrapper>
              <InputLabel>
                About
              </InputLabel>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={fileType}
                >
                  <StyledFormControlLabel value='readme' control={<Radio size='small' />} label='Readme File' />
                  <StyledFormControlLabel value='wiki' control={<Radio size='small' />} label='Wiki' />
                </RadioGroup>
              </FormControl>
              <Select
                sx={{
                  width: '100%',
                  fontSize: '.75rem',
                  borderRadius: '2px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: grey[500]
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '1px',
                    borderColor: grey[500]
                  },
                  '& .MuiSelect-select': {
                    padding: '.5rem'
                  }
                }}
                MenuProps={MenuProps}
                defaultValue='file destination'
              >
                <SelectItem value='git'>
                  Search Bar
                </SelectItem>
                <SelectItem value='team'>
                  Search results
                </SelectItem>
              </Select>
            </DialogContentWrapper>
            <div style={{ padding: '0 1.5rem' }}>
              <EmptyReadme />
            </div>
            <DialogActions sx={{ padding: '2rem 1rem 1rem 1rem' }}>
              <CancelButton onClick={handleClose}>
                Cancel</CancelButton>
              <CreateButton onClick={editProject}>
                Create</CreateButton>
            </DialogActions>
          </EditDialog>}
      </Box>
    </Box>
  )
}
