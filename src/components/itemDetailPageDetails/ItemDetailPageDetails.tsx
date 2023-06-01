import React, { ChangeEvent, useEffect, useState, useRef, Dispatch, SetStateAction } from 'react'
import { OpenInFull, ExpandMore, ExpandLess, Add, LocationOn, KeyboardArrowDown, InsertLink, TaskOutlined } from '@mui/icons-material'
import {
  Autocomplete, Avatar, Box, Divider, FormControl, Grid, Button, InputBase, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Menu, Link, ListSubheader, ListSubheaderProps
} from '@mui/material'
import { blue, grey, green, orange } from '@mui/material/colors'
import { useAppSelector } from '../../redux/hooks'
import styled from '@emotion/styled'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { selectUserName } from '../../redux/reducers/userSlice'
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

const ShowEditorIcon = styled(ExpandLess)({
  marginLeft: '.125rem',
  width: '.875rem',
  height: '.875rem',
  color: grey[800],
  '&:hover': {
    color: blue[700],
    cursor: 'pointer'
  }
})

const CloseEditorIcon = styled(ExpandMore)({
  marginLeft: '.125rem',
  width: '.875rem',
  height: '.875rem',
  color: grey[800],
  '&:hover': {
    color: blue[700],
    cursor: 'pointer'
  }
})

const DetailItemTitle = styled(Typography)({
  marginTop: '.25rem',
  marginBottom: '.125rem',
  fontSize: '.75rem',
  color: grey[600]
})

const DetailAutoCompleteInput = styled(InputBase)({
  display: 'inline-block',
  width: '100%',
  '& input': {
    padding: '.125rem 0 .125rem .25rem',
    fontSize: '.875rem',
    color: grey[600],
    border: '1px solid white',
    '&:hover': {
      border: `1px solid ${grey[200]}`
    },
    '&:focus': {
      border: `1px solid ${blue[600]}`
    }
  }
})

const DetailAutocompleteItem = styled(Typography)({
  fontSize: '.75rem',
  color: grey[600]
})

const DetailSelector = styled(InputBase)({
  fontSize: '.875rem',
  color: grey[600],
  '& .MuiInputBase-input': {
    border: '1px solid white',
    borderRadius: '0',
    '&:hover': {
      border: `1px solid ${grey[200]}`
    },
    '&:focus': {
      border: `1px solid ${blue[600]}`
    }
  },
  '& .MuiSelect-select': {
    padding: '0 0 0 .125rem'
  }
})

const DetailSelectorItem = styled(MenuItem)({
  fontSize: '.75rem',
  color: grey[600]
})

const TextInput = styled(TextField)({
  '& .MuiInputBase-input': {
    padding: '.125rem .25rem',
    fontSize: '.875rem',
    color: grey[600]
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: blue[600]
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: '0',
      borderColor: 'white'
    },
    '&:hover fieldset': {
      borderColor: grey[200]
    },
    '&.Mui-focused fieldset': {
      borderColor: blue[600]
    }
  }
})

const AddLinkButton = styled(Button)({
  borderRadius: '0',
  padding: '.125rem 0',
  '&:hover': {
    backgroundColor: blue[50]
  },
  '& .MuiButton-startIcon': {
    margin: '0'
  },
  '& .MuiButton-endIcon': {
    marginLeft: '.25rem',
    paddingRight: '.25rem'
  }
})

const AddLinkInput = styled(InputBase)({
  '& .MuiInputBase-input': {
    borderRadius: '0',
    border: `1px solid ${grey[500]}`
  }
})

const AddLinkDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    padding: '0 1rem 1rem 0',
    width: '32rem',
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

const formats = [
  'bold',
  'italic'
]

const QuillToolbar = (): JSX.Element => (
  <div id='toolbar' style={{ border: 'none' }}>
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
    </span>
  </div>
)

const modules = {
  toolbar: {
    container: '#toolbar'
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  }
}

const priority = ['1', '2', '3', '4']
const severity = ['1 - Critical', '2 - High', '3 - Medium', '4 - Low']
const activities = ['Deployment', 'Design', 'Development', 'Documentation', 'Requirements', 'Testing']
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

const DevLinkSubheader = (props: ListSubheaderProps): JSX.Element => <ListSubheader
  {...props}
  sx={{ color: blue[800], fontSize: '.875rem', borderBottom: `1px solid ${grey[200]}` }}
/>

DevLinkSubheader.muiSkipListHighlight = true
export default DevLinkSubheader

export const ItemDetailPageDetail = (
  editorValue: any,
  setEditorValue: Dispatch<SetStateAction<any>>,
  priorityValue: string,
  setPriorityValue: Dispatch<SetStateAction<string>>
): React.ReactElement => {
  const userName: any = useAppSelector(selectUserName)
  const name = userName ?? ''
  const [showEditor, setShowEditor] = useState(true)
  const handleShowEditor = (): void => setShowEditor(!showEditor)
  const reactQuill = useRef<any>(null)
  const [editorFocus, setEditorFocus] = useState(false)
  const handleEditorFoucs = (): void => setEditorFocus(true)
  const handleEditorBlur = (): void => setEditorFocus(false)
  // const [editorValue, setEditorValue] = useState<any>()
  const handleEditorValue = (content: any, delta: any, source: any, editor: any): void => setEditorValue(editor.getHTML())
  const [showDetails, setShowDetails] = useState(true)
  const handleShowDetails = (): void => setShowDetails(!showDetails)
  // const [priorityValue, setPriorityValue] = useState('')
  const [severityValue, setSeverityValue] = useState('')
  const [effortValue, setEffortValue] = useState('')
  const [remainingValue, setRemainingValue] = useState('')
  const [activityValue, setActivityValue] = useState('')
  const handleSeverityValue = (e: SelectChangeEvent): void => setSeverityValue(e.target.value)
  const handleEffortValue = (e: ChangeEvent<HTMLInputElement>): void => setEffortValue(e.currentTarget.value)
  const handleRemainingValue = (e: ChangeEvent<HTMLInputElement>): void => setRemainingValue(e.currentTarget.value)
  const [showBuild, setShowBuild] = useState(true)
  const handleShowBuild = (): void => setShowBuild(!showBuild)
  const [foundValue, setFoundValue] = useState('')
  const handleFoundValue = (e: SelectChangeEvent): void => setFoundValue(e.target.value)
  const [intergratedValue, setIntergratedValue] = useState('')
  const handleIntergratedValue = (e: SelectChangeEvent): void => setIntergratedValue(e.target.value)
  const [showDeployment, setShowDeployment] = useState(true)
  const handleShowDeployment = (): void => setShowDeployment(!showDeployment)
  const [showDevelopment, setShowDevelopment] = useState(true)
  const handleShowDevelopment = (): void => setShowDevelopment(!showDevelopment)
  const [openAddDevelopmenet, setOpenAddDevelopment] = useState(false)
  const handleAddDevelopment = (): void => setOpenAddDevelopment(true)
  const handleCloseAddDevelopmenet = (): void => setOpenAddDevelopment(false)
  const [devLinkValue, setDevLinkValue] = useState('Branch')
  const handleDevLinkValue = (e: SelectChangeEvent<string>): void => setDevLinkValue(e.target.value)
  const [showRelated, setShowRelated] = useState(true)
  const handleShowRelated = (): void => setShowRelated(!showRelated)
  const [anchorElRelatedLink, setAnchorElRelatedLink] = React.useState<null | HTMLElement>(null)
  const handleShowRelatedLink = (event: React.MouseEvent<HTMLButtonElement>): void => setAnchorElRelatedLink(event.currentTarget)
  const openRelatedLink = Boolean(anchorElRelatedLink)
  const handleCloseRelatedLink = (): void => setAnchorElRelatedLink(null)
  const [addRelatedDialog, setAddRelatedDialog] = useState(false)
  const handleShowAddRelatedDialog = (): void => {
    handleCloseRelatedLink()
    setAddRelatedDialog(true)
  }
  const handleCloseAddRelatedDialog = (): void => setAddRelatedDialog(false)
  const Editor = (params: { name: string, placeholder: string }): JSX.Element => {
    return <DetailItemContainer>
      <ItemTitleContainer>
        <ItemTitleOption direction='row'>
          <ItemTitleText>
            {params.name}
          </ItemTitleText>
          <FullScreenIcon />
          <CloseEditorIcon onClick={handleShowEditor} />
        </ItemTitleOption>
        <Divider sx={{ marginBottom: '.25rem' }} />
      </ItemTitleContainer>
      <Grid
        onClick={handleEditorFoucs}
        sx={{
          padding: '.25rem',
          height: '3rem',
          border: '1px solid white',
          color: grey[600],
          fontSize: '.75rem',
          fontStyle: 'italic',
          '&:hover': {
            border: `1px solid ${grey[200]}`,
            cursor: 'auto'
          }
        }}>
        {params.placeholder}
      </Grid>
    </DetailItemContainer>
  }

  // editor auto focus
  useEffect(() => {
    reactQuill.current?.focus()
  }, [editorFocus])

  useEffect(() => {
    console.log('rendering')
  })

  return <Box paddingRight='.5rem' height='26rem' sx={{ overflowY: 'auto' }}>
    {/* detail section */}
    <Grid container>
      {/* left column */}
      <Grid item lg={6} xs={12}>
        {/* repro steps */}
        <DetailItemContainer>
          <ItemTitleContainer>
            <ItemTitleOption direction='row'>
              <ItemTitleText>
                Repro Steps
              </ItemTitleText>
              <FullScreenIcon />
              {
                showEditor
                  ? <ShowEditorIcon onClick={handleShowEditor} />
                  : <CloseEditorIcon onClick={handleShowEditor} />
              }
            </ItemTitleOption>
            <Divider sx={{ marginBottom: '.25rem' }} />
          </ItemTitleContainer>
          {/* editor container */}
          {
            showEditor &&
            <div>
              {
                editorFocus
                  ? <div>
                    <ReactQuill
                      theme='snow'
                      modules={modules}
                      formats={formats}
                      ref={reactQuill}
                      value={editorValue}
                      onChange={handleEditorValue}
                      onBlur={handleEditorBlur}
                    />
                    <QuillToolbar />
                  </div>
                  : <Grid
                    onClick={handleEditorFoucs}
                    sx={{
                      padding: '.25rem',
                      height: '3rem',
                      border: '1px solid white',
                      color: grey[600],
                      fontSize: '.75rem',
                      fontStyle: 'italic',
                      '&:hover': {
                        border: `1px solid ${grey[200]}`,
                        cursor: 'auto'
                      }
                    }}>
                    Click to add Repro Steps
                  </Grid>
              }
            </div>
          }
        </DetailItemContainer>
        {/* System Info */}
        <Editor name='System Info' placeholder='Click to add System Info' />
        {/* Acceptance Criteria */}
        <Editor name={'Acceptance Criteria'} placeholder={'Click to add Acceptance Criteria'} />
        {/* Discussion */}
        <DetailItemContainer>
          <ItemTitleContainer>
            <ItemTitleOption direction='row'>
              <ItemTitleText>
                Discussion
              </ItemTitleText>
              <FullScreenIcon />
              {
                showEditor
                  ? <ShowEditorIcon onClick={handleShowEditor} />
                  : <CloseEditorIcon onClick={handleShowEditor} />
              }
            </ItemTitleOption>
            <Divider sx={{ marginBottom: '.25rem' }} />
          </ItemTitleContainer>
          {
            showEditor &&
            <Stack direction='row'>
              <Avatar sx={{
                width: '1.5rem',
                height: '1.5rem',
                backgroundColor: blue[800],
                fontSize: '.875rem'
              }}>
                {name?.toLocaleUpperCase().charAt(0)}
              </Avatar>
              <Grid
                sx={{
                  marginLeft: '.5rem',
                  padding: '.25rem',
                  height: '6rem',
                  border: `1px solid ${grey[200]}`,
                  borderRadius: '.315rem',
                  color: grey[600],
                  fontSize: '.875rem',
                  fontStyle: 'italic',
                  '&:hover': {
                    border: `1px solid ${grey[200]}`,
                    cursor: 'auto'
                  }
                }}>
                Add a comment. Use # to link a work item, ! to link a pull request, or @ to mention a person
              </Grid>
            </Stack>
          }
        </DetailItemContainer>
      </Grid>
      {/* middle column */}
      <Grid item lg={3} xs={12}>
        {/* details */}
        <DetailItemContainer>
          <ItemTitleContainer>
            <ItemTitleOption direction='row'>
              <ItemTitleText>
                Details
              </ItemTitleText>
              {
                showDetails
                  ? <ShowEditorIcon onClick={handleShowDetails} />
                  : <CloseEditorIcon onClick={handleShowDetails} />
              }
            </ItemTitleOption>
            <Divider sx={{ marginBottom: '.25rem' }} />
          </ItemTitleContainer>
          {
            showDetails &&
            <Stack>
              <Stack>
                <DetailItemTitle>
                  Priority
                </DetailItemTitle>
                <Autocomplete
                  // value={props.priorityValue}
                  inputValue={priorityValue}
                  onInputChange={(e, newInputValue) => {
                    setPriorityValue(newInputValue)
                    console.log('newInputValue: ', newInputValue)
                    console.log('props.priorityValue: ', priorityValue)
                  }}
                  options={priority}
                  renderInput={
                    (params) =>
                      <DetailAutoCompleteInput
                        ref={params.InputProps.ref}
                        inputProps={params.inputProps}
                      />
                  }
                  renderOption={(props, option: any) => (
                    <Box component="li" {...props} >
                      <DetailAutocompleteItem>
                        {option}
                      </DetailAutocompleteItem>
                    </Box>
                  )}
                />
              </Stack>
              <DetailItemTitle>
                Severity
              </DetailItemTitle>
              <FormControl>
                <Select
                  value={severityValue}
                  onChange={handleSeverityValue}
                  input={<DetailSelector />}
                >
                  {
                    severity.map((item, index) => (
                      <DetailSelectorItem key={index} value={item}>
                        {item}
                      </DetailSelectorItem>
                    )
                    )
                  }
                </Select>
              </FormControl>
              <DetailItemTitle>
                Effort
              </DetailItemTitle>
              <TextInput
                value={effortValue}
                onChange={handleEffortValue}
              />
              <DetailItemTitle>
                Remaining Work
              </DetailItemTitle>
              <TextInput
                value={remainingValue}
                onChange={handleRemainingValue}
              />
              <DetailItemTitle>
                Activity
              </DetailItemTitle>
              <Autocomplete
                inputValue={activityValue}
                onInputChange={(e, newInputValue) => setActivityValue(newInputValue)}
                options={activities}
                renderInput={
                  (params) =>
                    <DetailAutoCompleteInput
                      ref={params.InputProps.ref}
                      inputProps={params.inputProps}
                    />
                }
                renderOption={(props, option: any) => (
                  <Box component="li" {...props} >
                    <DetailAutocompleteItem>
                      {option}
                    </DetailAutocompleteItem>
                  </Box>
                )}
              />
            </Stack>
          }
        </DetailItemContainer>
        <DetailItemContainer>
          <ItemTitleContainer>
            <ItemTitleOption direction='row'>
              <ItemTitleText>
                Build
              </ItemTitleText>
              {
                showDetails
                  ? <ShowEditorIcon onClick={handleShowBuild} />
                  : <CloseEditorIcon onClick={handleShowBuild} />
              }
            </ItemTitleOption>
            <Divider sx={{ marginBottom: '.25rem' }} />
          </ItemTitleContainer>
          <DetailItemTitle>
            Found in Build
          </DetailItemTitle>
          <Select
            value={foundValue}
            onChange={handleFoundValue}
            input={<DetailSelector />}
          >
            <DetailSelectorItem value='none'>
              None
            </DetailSelectorItem>
          </Select>
          <DetailItemTitle>
            Integrated in Build
          </DetailItemTitle>
          <Select
            value={intergratedValue}
            onChange={handleIntergratedValue}
            input={<DetailSelector />}
          >
            <DetailSelectorItem value='none'>
              None
            </DetailSelectorItem>
          </Select>
        </DetailItemContainer>
      </Grid>
      {/* right column */}
      <Grid item lg={3} xs={12}>
        {/* deployment */}
        <DetailItemContainer>
          <ItemTitleContainer direction='row'>
            <ItemTitleText>
              Deployment
            </ItemTitleText>
            {
              showDeployment
                ? <ShowEditorIcon onClick={handleShowDeployment} />
                : <CloseEditorIcon onClick={handleShowDeployment} />
            }
          </ItemTitleContainer>
          <Divider sx={{ marginBottom: '.25rem' }} />
          {
            showDeployment &&
            <Stack direction='row' sx={{ display: 'flex', padding: '.5rem', backgroundColor: grey[100], alignItems: 'center' }}>
              <img src='/Nav-Launch.3tiJhd.png' alt='deployment' width='30' height='30' />
              <Typography sx={{ marginLeft: '.5rem', fontSize: '.75rem', color: grey[700] }}>
                To track releases associated with this work item, go to
                <a href='https://google.com' style={{ color: blue[900], textDecoration: 'none' }}>
                  Releases
                </a>
                and turn on deployment status reporting for Boards
                in your pipelines Options menu.
                <a href='https://google.com' style={{ color: blue[900], textDecoration: 'none' }}>
                  Learn more about deployment status reporting
                </a>
              </Typography>
            </Stack>
          }
        </DetailItemContainer>
        {/* development */}
        <DetailItemContainer>
          <ItemTitleContainer direction='row'>
            <ItemTitleText>
              Development
            </ItemTitleText>
            {
              showDevelopment
                ? <ShowEditorIcon onClick={handleShowDevelopment} />
                : <CloseEditorIcon onClick={handleShowDevelopment} />
            }
          </ItemTitleContainer>
          <Divider sx={{ marginBottom: '.25rem' }} />
          {
            showDevelopment &&
            <>
              <AddLinkButton
                sx={{ width: '5.125rem' }}
                startIcon={<Add sx={{ marginRight: '0', color: green[700] }} />}
                onClick={handleAddDevelopment}
              >
                <Typography sx={{ color: grey[800], fontSize: '.75rem' }}>
                  add link
                </Typography>
              </AddLinkButton>
              <AddLinkDialog
                open={openAddDevelopmenet}
                onClose={handleCloseAddDevelopmenet}
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
                    value={devLinkValue}
                    onChange={handleDevLinkValue}
                    input={<AddLinkInput />}
                  >
                    {
                      developmentLink.map((item, index) =>
                        <Stack key={index}>
                          <DevLinkSubheader key={index}>
                            {item.groupName}
                          </DevLinkSubheader>
                          {
                            item.links.map((item, index) =>
                              <MenuItem key={index} value={item} sx={{ fontSize: '.875rem' }}>
                                {item}
                              </MenuItem>)
                          }
                        </Stack>
                      )
                    }
                  </Select>
                  <Stack style={{ marginTop: '.5rem', padding: '.5rem', backgroundColor: orange[50] }}>
                    <DialogContentText
                      sx={{ color: grey[700], fontSize: '.75rem' }}
                    >
                      No Git repositories were found in this project collection.
                    </DialogContentText>
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button
                    disabled
                    sx={{ color: grey[300] }}
                    onClick={handleCloseAddDevelopmenet}
                  >
                    OK
                  </Button>
                  <CancelButton
                    onClick={handleCloseAddDevelopmenet}
                  >
                    Cancel
                  </CancelButton>
                </DialogActions>
              </AddLinkDialog>
            </>
          }
        </DetailItemContainer>
        {/* related work */}
        <DetailItemContainer>
          <ItemTitleContainer direction='row'>
            <ItemTitleText>
              Related Work
            </ItemTitleText>
            {
              showRelated
                ? <ShowEditorIcon onClick={handleShowRelated} />
                : <CloseEditorIcon onClick={handleShowRelated} />
            }
          </ItemTitleContainer>
          <Divider sx={{ marginBottom: '.25rem' }} />
          <AddLinkButton
            sx={{ width: '5.615rem' }}
            startIcon={<Add sx={{ marginRight: '0', color: green[700] }} />}
            endIcon={<KeyboardArrowDown sx={{ width: '.75rem', height: '.75rem', color: grey[700] }} />}
            onClick={handleShowRelatedLink}
          >
            <Typography sx={{ color: grey[800], fontSize: '.75rem' }}>
              add link
            </Typography>
          </AddLinkButton>
          <Menu
            anchorEl={anchorElRelatedLink}
            open={openRelatedLink}
            onClose={handleCloseRelatedLink}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={handleShowAddRelatedDialog}>
              <InsertLink sx={{ width: '1.125rem', height: '1.25rem', color: grey[800] }} />
              <Typography sx={{ marginLeft: '.75rem', fontSize: '.815rem', color: grey[700] }}>
                Existing item
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseRelatedLink}>
              <TaskOutlined sx={{ width: '1.125rem', height: '1.25rem', color: grey[800] }} />
              <Typography sx={{ marginLeft: '.75rem', fontSize: '.815rem', color: grey[500] }}>
                New item
              </Typography>
            </MenuItem>
          </Menu>
          <Stack sx={{ marginTop: '.125rem', padding: '.615rem', background: grey[100] }}>
            <Typography sx={{ fontSize: '.75rem', color: grey[800] }}>
              <Link href='#' underline='none' onClick={handleShowAddRelatedDialog}>Add an existing work item</Link> as a parent
            </Typography>
          </Stack>
          {/* add Related Work Dialog */}
          <ItemDetailPageAddExistItem
            addRelatedDialog={addRelatedDialog}
            handleCloseAddRelatedDialog={handleCloseAddRelatedDialog}
          />
        </DetailItemContainer>
      </Grid>
    </Grid>
  </Box>
}
