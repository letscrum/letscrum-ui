import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  Box, Stack, Avatar, Typography, Button, IconButton, Divider, Grid, Paper, Link, Chip, FormControl, Select, MenuItem, SelectChangeEvent,
  Dialog, DialogTitle, AlertProps, DialogContent, DialogContentText, TextField, RadioGroup, Radio, FormControlLabel, DialogActions, InputAdornment, Tooltip, TooltipProps, tooltipClasses,
  Autocomplete, Checkbox
} from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { StarOutline, Lock, GroupAdd, TrendingUp, Edit, Assignment, AssignmentTurnedIn, Commit, Close, Add, Clear, FilterAlt, Hub, ContactMailOutlined } from '@mui/icons-material'
import { grey, red, blue, purple } from '@mui/material/colors'
import styled from '@emotion/styled'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import {
  fecthProject, selectProjcetLoading, selectProjcetUpdateLoading, selectProjectDescription, selectProjectDisplayName, selectProjectError,
  selectProjectMembers, selectProjectUpdateError, updateProject
} from '../../redux/reducers/projectSlice'
import { useParams } from 'react-router-dom'
import PickAvatarColor from '../../utils/PickAvatarColor'
import axios from 'axios'

interface UserType {
  createdAt: string
  email: string
  id: string
  isSuperAdmin: boolean
  name: string
  password: string
  token: string
  updatedAt: string
}

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
  },
  '& .MuiPaper-root': {
    height: 'calc(100% - 4rem)'
  }
})
const DialogContentWrapper = styled(DialogContent)({
  flex: '0 0 auto',
  width: '32.5rem',
  height: 'auto',
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
  fontSize: '1rem',
  marginBottom: '.25rem'
})
const InputBar = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: 2,
      borderColor: grey[700]
    },
    '&:hover fieldset': {
      borderWidth: 1,
      boxShadow: '0 0 0 2px #bbdefb'
    },
    '&.Mui-focused fieldset': {
      borderWidth: 1,
      boxShadow: '0 0 0 2px #bbdefb'
    }
  }
})
const AutoCompleteInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: 2,
      borderColor: grey[500]
    },
    '&:hover fieldset': {
      borderWidth: 1,
      boxShadow: '0 0 0 2px #bbdefb'
    },
    '&.Mui-focused fieldset': {
      borderWidth: 1,
      boxShadow: '0 0 0 2px #bbdefb'
    }
  }
})
const AddTagsButton = styled(Button)({
  height: '1.5rem',
  marginTop: '.25rem',
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
  marginTop: '.25rem',
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
  // position: 'relative',
  // top: '1.5px',
  marginRight: '.5rem',
  marginTop: '.25rem',
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
  marginRight: '.5rem',
  marginTop: '.25rem',
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
const AboutSelect = styled(Select)({
  width: '100%',
  borderRadius: '2px',
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: grey[500]
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px',
    borderColor: grey[500]
  },
  '& .MuiSelect-select': {
    display: 'flex',
    padding: '.5rem',
    alignItems: 'center'
  }
})
const MenuProps = {
  PaperProps: {
    style: {
      borderRadius: '2px'
    }
  }
}
const FilterInput = styled(TextField)({
  width: '100%',
  '& .MuiInputBase-root': {
    borderRadius: 2,
    backgroundColor: grey[100],
    padding: 1
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderStyle: 'none'
    }
  },
  '& .MuiInputAdornment-root': {
    width: '2rem',
    marginRight: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  '& .MuiSvgIcon-root': {
    fontSize: '.875rem',
    color: grey[500]
  },
  '& .MuiInputBase-input': {
    width: '12.5rem',
    padding: '2px 3px',
    height: '1.5rem',
    fontSize: '.875rem',
    fontWeight: '300',
    color: grey[900]
  }
})
const SelectSearchBar = styled(MenuItem)({
  paddingLeft: '.5rem',
  paddingRight: '.5rem',
  fontSize: '.75rem',
  // backgroundColor: 'white',
  '& .MuiButtonBase-root': {
    backgroundColor: 'white'
  },
  '& .MuiMenuItem-root': {
    backgroundColor: 'white'
  },
  '&:hover': {
    backgroundColor: 'white'
  }
})
const SelectItem = styled(MenuItem)({
  paddingLeft: '.5rem',
  paddingRight: '.5rem',
  fontSize: '.75rem'
})
const MenuItemHub = styled(Hub)({
  marginRight: '.5rem',
  fontSize: '1rem',
  color: purple[800]
})
const MenuItemText = styled(Typography)({
  fontSize: '.75rem'
})
const TrendingUpContainer = styled('div')({
  display: 'flex',
  width: '5rem',
  height: '5rem',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: grey[100],
  borderRadius: '50%'
})
const StateContainer = styled(Stack)({
  display: 'flex',
  height: '4rem',
  alignItems: 'center'
})
const StateIconBackground = styled('div')({
  display: 'flex',
  marginRight: '1rem',
  width: '2rem',
  height: '2rem',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: grey[100],
  borderRadius: '2px'
})
const StateCounter = styled(Typography)({
  fontSize: '.875rem',
  fontWeight: 'bold'
})
const StateDecription = styled(Typography)({
  fontSize: '.75rem',
  color: grey[500]
})
const MembersNumber = styled(Chip)({
  marginTop: '.125rem',
  marginLeft: '.25rem',
  px: '.25rem',
  backgroundColor: grey[100]
})
const MemberAvatar = styled(Avatar)({
  width: '1.875rem',
  height: '1.875rem',
  marginTop: '1rem'
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
  const [showInvitation, setShowInvitation] = useState(false)
  const { projectId } = useParams()
  const id = projectId ?? ''
  const fetchLoading = useAppSelector(selectProjcetLoading)
  const fetchError = useAppSelector(selectProjectError)
  const displayName = useAppSelector(selectProjectDisplayName)
  const description = useAppSelector(selectProjectDescription)
  const members = useAppSelector(selectProjectMembers)
  const [newDescription, setNewDescription] = useState('')
  const dispatch = useAppDispatch()
  const updateLoading = useAppSelector(selectProjcetUpdateLoading)
  const updateError = useAppSelector(selectProjectUpdateError)
  const [period, setPeriod] = useState('7')
  const [addTagsButtonShow, setAddTagsButtonShow] = useState(true)
  const [addTagsIconButtonShow, setAddTagsIconButtonShow] = useState(false)
  const [tagInputShow, setTagInputShow] = useState(false)
  const [tagValue, setTagValue] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [aboutType, setAboutType] = useState('readme')
  const [repositoryKeyword, setRepositoryKeyword] = useState('')
  const defaultRepos = [{
    id: '1',
    name: 'imoogoo',
    value: 'imoogoo'
  },
  {
    id: '2',
    name: 'shinemap',
    value: 'shinemap'
  },
  {
    id: '3',
    name: 'simpletour',
    value: 'simpletour'
  }]
  const [repos, setRepos] = useState(defaultRepos)
  const initUser: UserType[] = [{
    createdAt: 'string',
    email: 'string@Email.com',
    id: '123',
    isSuperAdmin: false,
    name: 'userName',
    password: 'string',
    token: '',
    updatedAt: 'string'
  }]
  const [users, setUsers] = useState<UserType[]>(initUser)
  // const [selectedMembers, setSelectedMembers] = useState<UserType[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState('')
  const [openUsers, setOpenUsers] = useState(false)
  const [theTeam, setTheTeam] = useState<string>('')
  const handlePeriod = (e: SelectChangeEvent): void => setPeriod(e.target.value)
  const handleShow = (): void => setShow(true)
  const handleClose = (): void => {
    setShow(false)
    setNewDescription('')
    setAboutType('readme')
    setRepositoryKeyword('')
  }
  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>): void => setNewDescription(e.currentTarget.value)
  const handleAddtagsButtonShow = (): void => {
    setAddTagsButtonShow(false)
    setTagInputShow(true)
  }
  const handleAddTagsInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => setTagValue(e.currentTarget.value)
  const handleEnerAddTag = (e: any): void => {
    const value = e.key
    if (value === 'Enter') {
      setTagInputShow(false)
      setAddTagsButtonShow(false)
      setAddTagsIconButtonShow(true)
      setTags([
        ...tags,
        tagValue
      ])
    }
  }
  const handleBlurAddTag = (): void => {
    setTags([
      ...tags,
      tagValue
    ])
    setTagInputShow(false)
    setAddTagsButtonShow(false)
    setAddTagsIconButtonShow(true)
  }
  const handleTagsDelete = (index: number, e: ChangeEvent<HTMLInputElement>): void => setTags(tags.filter(t => t !== tags[index]))
  const handleAboutType = (e: ChangeEvent<HTMLInputElement>): void => setAboutType((e.target as HTMLInputElement).value)
  const handleRepositorySearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const keyword = e.target.value
    setRepositoryKeyword(keyword)
    console.log('keyword: ', keyword)
    keyword !== null
      ? setRepos(defaultRepos.filter((i) => {
        console.log('i.value', i.value)
        console.log('i.value.match', i.value.match(keyword))
        return i.value.match(keyword) !== null
      }))
      : setRepos(defaultRepos)
    console.log('keyword: ', keyword, ' + repos: ', defaultRepos.filter((i) => i.value.match(keyword) !== null))
    console.log('repos: ', repos)
  }
  const handleSaveProject = (): void => {
    // update project data
    dispatch(updateProject({ id, displayName, newDescription }))
      .catch(() => updateError)
    handleClose()
    // re-render detail
    dispatch(fecthProject({ id }))
      .catch(() => fetchError)
  }
  const handleShowInvitaion = (): void => setShowInvitation(true)
  const handleCloseInvitation = (): void => {
    setShowInvitation(false)
    setTheTeam('')
  }
  const handleTeam = (event: any): void => {
    const {
      target: { value }
    } = event
    setTheTeam(value)
  }
  const fetchUsers = async (): Promise<any> => {
    try {
      const response = await axios.get('v1/users')
      setLoadingUsers(false)
      console.log('response.data.items: ', response.data.items)
      // add and update invited users, but code failed
      // setUsers([
      //   ...users,
      //   response.data.items
      // ])
      console.log('setUsers: ', setUsers)
      return users
    } catch (e: any) {
      setUsersError(e.message)
      setLoadingUsers(false)
      return usersError
    }
  }
  useEffect(() => {
    void fetchUsers()
  }, [])
  useEffect(() => {
    // fetch data by default
    dispatch(fecthProject({ id }))
      .catch(() => alert(fetchError))
    // update tags
    if (tags.length === 0) {
      setAddTagsButtonShow(true)
      setAddTagsIconButtonShow(false)
    }
  }, [tags])
  return (
    <Box width='100%'>
      {/* detail page */}
      <>
        {
          fetchLoading ||
          <Box width='calc(100wh - 16rem - 1px)'>
            {/* header */}
            <HeaderWrapper direction='row'>
              <Avatar variant='rounded' sx={{ backgroundColor: PickAvatarColor(id) }}>T</Avatar>
              <TitleText variant='h6' >{displayName}</TitleText>
              <HelpTooltip disableFocusListener title='Shared with members of the project'>
                <PrivateButton variant='contained' size='small' disableElevation >
                  <Lock sx={{ fontSize: '1rem' }} />
                  <HeaderButtonText>Private</HeaderButtonText>
                </PrivateButton>
              </HelpTooltip>
              <InviteButton variant='contained' size='small' disableElevation onClick={handleShowInvitaion}>
                <GroupAdd sx={{ fontSize: '1rem' }} />
                <HeaderButtonText>Invite</HeaderButtonText>
              </InviteButton>
              <HelpTooltip disableFocusListener title='Add to favorites'>
                <FavoriteButton>
                  <StarOutline sx={{ fontSize: '1rem', color: 'brown' }} />
                </FavoriteButton>
              </HelpTooltip>
            </HeaderWrapper>
            <HeaderDivider />
            {/* main content */}
            <MainWrapper>
              <Grid container spacing={2}>
                <Grid item md={12} lg={8} >
                  {/* about */}
                  {
                    (description === null && tags.length === 0)
                      // empty about
                      ? <ContentWrapper>
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
                          <Link sx={{ marginTop: '1rem', textDecoration: 'none', cursor: 'pointer' }}>
                            or manage your services
                          </Link>
                        </Grid>
                      </ContentWrapper>
                      : <ContentWrapper>
                        <Stack direction='row' >
                          <Typography variant='h6' fontWeight='bold'>
                            About this project
                          </Typography>
                          <HelpTooltip disableFocusListener title='Edit project information'>
                            <AboutEditButton onClick={handleShow}>
                              <Edit sx={{ fontSize: '1rem' }} />
                            </AboutEditButton>
                          </HelpTooltip>
                        </Stack>
                        <Typography variant='body2' sx={{ marginTop: '2rem', marginBottom: '1rem' }}>
                          description: {description}
                          <br />
                          newDescription: {newDescription}
                        </Typography>
                        {
                          tags.length !== 0 && <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <InputLabel>
                              Tags
                            </InputLabel>
                            {tags.map((item, index) => {
                              return (
                                <TagChip key={`${item} + ${index}`} label={item} onDelete={(e) => handleTagsDelete(index, e)} deleteIcon={<Clear />} />
                              )
                            })}
                          </div>
                        }
                        <EmptyReadme />
                      </ContentWrapper>
                  }
                </Grid>
                <Grid item md={12} lg={4}>
                  {/* empty stats */}
                  {
                    (description === null && tags.length === 0)
                      ? <ContentWrapper>
                        <Typography variant='h6' fontWeight='bold'>Project stats</Typography>
                        <Grid container sx={{ flexDirection: 'column', my: '4rem', justifyContent: 'center', alignItems: 'center' }}>
                          <TrendingUpContainer>
                            <TrendingUp />
                          </TrendingUpContainer>
                          <Typography variant='body2' fontWeight='bold' marginTop='3rem'>
                            No stats are available at this moment
                          </Typography>
                          <Typography variant='body2' marginTop='1rem'>
                            Setup a service to see project activity.
                          </Typography>
                        </Grid>
                      </ContentWrapper>
                      : <ContentWrapper>
                        {/* no api data */}
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
                              <StateContainer direction='row'>
                                <StateIconBackground>
                                  <Assignment sx={{ fontSize: '1rem' }} />
                                </StateIconBackground>
                                <Grid item xs={8}>
                                  <StateCounter>0</StateCounter>
                                  <StateDecription>Work items created</StateDecription>
                                </Grid>
                              </StateContainer>
                            </Grid>
                            <Grid item xs={6}>
                              <StateContainer direction='row'>
                                <StateIconBackground>
                                  <AssignmentTurnedIn sx={{ fontSize: '1rem' }} />
                                </StateIconBackground>
                                <Grid item xs={8}>
                                  <StateCounter>0</StateCounter>
                                  <StateDecription>Work items completed</StateDecription>
                                </Grid>
                              </StateContainer>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} paddingY='1rem'>
                            <Typography>Repos</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <StateContainer direction='row'>
                              <StateIconBackground>
                                <Commit sx={{ fontSize: '1rem' }} />
                              </StateIconBackground>
                              <Grid item xs={8}>
                                <StateCounter>0</StateCounter>
                                <StateDecription>Changesets by 0 authors</StateDecription>
                              </Grid>
                            </StateContainer>
                          </Grid>
                        </Box>
                      </ContentWrapper>
                  }
                  {/* members */}
                  <ContentWrapper sx={{ marginTop: '1rem' }}>
                    <Stack direction='row'>
                      <Typography variant='h6' fontWeight='bold'>Members</Typography>
                      <MembersNumber
                        size='small'
                        label={members.length} />
                    </Stack>
                    <Grid container>
                      {
                        members.map((item: { userId: string | null, userName: string | null }) => {
                          return (
                            <MemberAvatar key={item.userId}>
                              <Typography variant='body2' color='white'>
                                {item.userName?.toString().toUpperCase().charAt(0)}
                              </Typography>
                            </MemberAvatar>
                          )
                        })
                      }
                    </Grid>
                  </ContentWrapper>
                </Grid>
              </Grid>
            </MainWrapper >
          </Box>
        }
        {/* edit about pop */}
        <Box component='form' noValidate>
          {show &&
            <EditDialog open={show} onClose={handleClose}>
              {updateLoading && <Typography>loading</Typography>}
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
              {(Boolean(updateError)) && <Alert severity="error">{updateError}</Alert>}
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
                  value={newDescription}
                />
              </DialogContentWrapper>
              {/* tags */}
              <DialogContentWrapper>
                <InputLabel>
                  Tags
                </InputLabel>
                {/* add tags button */}
                {
                  addTagsButtonShow &&
                  <AddTagsButton onClick={handleAddtagsButtonShow}>
                    Add tags
                  </AddTagsButton>
                }
                {/* tags */}
                {
                  tags.length !== 0 &&
                  tags.map((item, index) => {
                    return (
                      <TagChip key={`${item} + ${index}`} label={item} onDelete={(e) => handleTagsDelete(index, e)} deleteIcon={<Clear />} />
                    )
                  })
                }
                {/* input bar */}
                {
                  tagInputShow &&
                  <AddTagsInput
                    onChange={handleAddTagsInputChange}
                    onKeyDown={handleEnerAddTag}
                    onBlur={handleBlurAddTag} />
                }
                {/* add icon button */}
                {
                  addTagsIconButtonShow &&
                  <AddTagsIconButton startIcon={<Add />} onClick={handleAddtagsButtonShow} />
                }
              </DialogContentWrapper>
              {/* about */}
              <DialogContentWrapper>
                <InputLabel>
                  About
                </InputLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={aboutType}
                  onChange={handleAboutType}
                >
                  <StyledFormControlLabel label='Readme File' value='readme' control={<Radio size='small' />} />
                  <StyledFormControlLabel label='Wiki' value='wiki' control={<Radio size='small' />} />
                </RadioGroup>
                {aboutType === 'readme' &&
                  <AboutSelect
                    MenuProps={MenuProps}
                    defaultValue=''
                  >
                    {/* search bar */}
                    <SelectSearchBar>
                      <FilterInput
                        placeholder='Filter repositories'
                        value={repositoryKeyword}
                        size='small'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FilterAlt />
                            </InputAdornment>
                          )
                        }}
                        onChange={handleRepositorySearch}
                      // onKeyDown={handleSubmitRepositorySearch}
                      />
                    </SelectSearchBar>
                    {/* item list */}
                    {
                      repos.map((item, index) => {
                        return (
                          <SelectItem key={`${index} + ${item.value}`} value={item.value}>
                            <MenuItemHub />
                            <MenuItemText>
                              {item.name}
                            </MenuItemText>
                          </SelectItem>
                        )
                      })
                    }
                  </AboutSelect>
                }
              </DialogContentWrapper>
              <div style={{ padding: '0 1.5rem' }}>
                <EmptyReadme />
              </div>
              <DialogActions sx={{ padding: '2rem 1rem 1rem 1rem', marginTop: 'auto' }}>
                <CancelButton onClick={handleClose}>
                  Cancel</CancelButton>
                <CreateButton onClick={handleSaveProject}>
                  Save</CreateButton>
              </DialogActions>
            </EditDialog>}
        </Box>
        {/* invite new members */}
        <Box component='form' noValidate>
          {
            showInvitation &&
            <EditDialog open={showInvitation} onClose={handleCloseInvitation}>
              {/* title */}
              <Stack direction='row'>
                <div>
                  <EditTitle sx={{ paddingBottom: '0' }}>Invite members to {displayName}</EditTitle>
                  <EditTitle sx={{ paddingTop: '0', fontSize: '.875rem' }}>
                    Search and add users to your {displayName}
                  </EditTitle>
                </div>
                <Grid sx={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }}>
                  <IconButton sx={{ marginRight: '.5rem' }} onClick={handleCloseInvitation} >
                    <Close />
                  </IconButton>
                </Grid>
              </Stack>
              <DialogContentWrapper>
                <InputLabel>
                  Users
                </InputLabel>
                <Autocomplete
                  freeSolo
                  multiple
                  disableClearable
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: '0'
                    },
                    '& .MuiChip-root': {
                      '& .MuiChip-avatar': {
                        marginLeft: '0',
                        color: 'white'
                      }
                    }
                  }}
                  open={openUsers}
                  onOpen={() => setOpenUsers(true)}
                  onClose={() => setOpenUsers(false)}
                  // value={selectedMembers}
                  // onChange={(e, newSelected: any) => {
                  //   console.log('====================newSelected: ', newSelected)
                  //   console.log('====================before selectedMembers: ', selectedMembers)
                  //   setSelectedMembers([
                  //     ...selectedMembers,
                  //     newSelected
                  //   ])
                  //   console.log('====================after selectedMembers: ', selectedMembers)
                  // }}
                  loading={loadingUsers}
                  options={users}
                  getOptionLabel={(option: any) => option.name ?? option}
                  renderOption={(props, option, { selected }) => (
                    <MenuItem
                      {...props}
                      sx={{
                        padding: '.25rem 0',
                        '&:hover': { backgroundColor: grey[200] }
                      }}
                    >
                      <Avatar sx={{ marginRight: '.5rem', width: '1.5rem', height: '1.5rem', backgroundColor: PickAvatarColor('12'), fontSize: '.75rem' }}>
                        {option.name.toString().toUpperCase().charAt(0)}
                      </Avatar>
                      <Stack>
                        <Typography variant='body2'>{option.name}</Typography>
                        <Typography sx={{ fontSize: '.75rem', color: grey[700] }}>{option.email}</Typography>
                      </Stack>
                      <ContactMailOutlined sx={{ marginLeft: 'auto', fontSize: '1rem', color: grey[700] }} />
                    </MenuItem>
                  )}
                  renderInput={(params) => (
                    <AutoCompleteInput
                      {...params}
                      // sx={{
                      //   '&::placeholder': {
                      //     fontSize: '.75rem', color: grey[600]
                      //   }
                      // }}
                      placeholder='Use semicolons to separate multiple email addresses.'
                      InputProps={{
                        ...params.InputProps,
                        type: 'search'
                      }}
                    />
                  )}
                  renderTags={(value: readonly UserType[], getTagProps) =>
                    value.map((option: UserType, index: number) => (
                      // eslint-disable-next-line react/jsx-key
                      <Chip
                        sx={{ height: '1.5rem', fontSize: '.75rem' }}
                        avatar={
                          <Avatar sx={{ marginLeft: '0', backgroundColor: PickAvatarColor('12'), fontSize: '.75rem' }}>
                            {option.name?.toString().toUpperCase().charAt(0)}
                          </Avatar>
                        }
                        deleteIcon={<Clear sx={{ width: '.875rem', height: '.875rem' }} />}
                        label={option.name ?? ''}
                        {...getTagProps({ index })} />
                    ))
                  }
                />
              </DialogContentWrapper>
              <DialogContentWrapper>
                <InputLabel>
                  Add to team(s)
                </InputLabel>
                <AboutSelect
                  MenuProps={MenuProps}
                  defaultValue=''
                  value={theTeam}
                  onChange={handleTeam}
                >
                  {/* item list */}
                  {
                    repos.map((item, index) => {
                      return (
                        <SelectItem key={`${index} + ${item.value}`} value={item.value}>
                          <Checkbox sx={{ padding: '0' }} checked={theTeam.includes(item.value)} />
                          <MenuItemText sx={{ marginLeft: '.5rem' }}>
                            {item.name}
                          </MenuItemText>
                        </SelectItem>
                      )
                    })
                  }
                </AboutSelect>
              </DialogContentWrapper>
              <DialogActions sx={{ padding: '2rem 1rem 1rem 1rem', marginTop: 'auto' }}>
                <CancelButton onClick={handleCloseInvitation}>
                  Cancel</CancelButton>
                <CreateButton>
                  Create</CreateButton>
                <CancelButton disabled>
                  Create</CancelButton>
              </DialogActions>
            </EditDialog>
          }
        </Box>
      </>
    </Box>
  )
}
