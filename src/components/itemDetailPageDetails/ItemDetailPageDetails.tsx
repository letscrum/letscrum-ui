import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { OpenInFull, ExpandMore, ExpandLess } from '@mui/icons-material'
import { Autocomplete, Avatar, Box, Divider, FormControl, Grid, InputBase, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import { blue, grey } from '@mui/material/colors'
import { useAppSelector } from '../../redux/hooks'
import styled from '@emotion/styled'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './ItemDetailPageTitle.module.css'
import { selectUserName } from '../../redux/reducers/userSlice'

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

const Input = styled(TextField)({
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

export const ItemDetailPageDetail: React.FC = () => {
  const userName = useAppSelector(selectUserName)
  const name = userName ?? ''
  const [showEditor, setShowEditor] = useState(true)
  const handleShowEditor = (): void => setShowEditor(!showEditor)
  const reactQuill = useRef<any>(null)
  const [editorFocus, setEditorFocus] = useState(false)
  const [editorValue, setEditorValue] = useState<any>()
  const handleEditorFoucs = (): void => setEditorFocus(true)
  const handleEditorBlur = (): void => setEditorFocus(false)
  const handleEditorValue = (content: any, delta: any, source: any, editor: any): void => setEditorValue(editor.getHTML())
  const [showDetails, setShowDetails] = useState(true)
  const handleShowDetails = (): void => setShowDetails(!showDetails)
  const [priorityValue, setPriorityValue] = useState('')
  const [severityValue, setSeverityValue] = useState('')
  const [effortValue, setEffortValue] = useState('')
  const [remainingValue, setRemainingValue] = useState('')
  const [activityValue, setActivityValue] = useState('')
  const handleSeverityValue = (e: SelectChangeEvent): void => setSeverityValue(e.target.value)
  const handleEffortValue = (e: ChangeEvent<HTMLInputElement>): void => setEffortValue(e.currentTarget.value)
  const handleRemainingValue = (e: ChangeEvent<HTMLInputElement>): void => setRemainingValue(e.currentTarget.value)
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

  return <Grid>
    {/* detail section */}
    <Grid container>
      {/* left column */}
      <Grid item md={6} xs={12}>
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
      <Grid item md={3} xs={12}>
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
                  inputValue={priorityValue}
                  onInputChange={(e, newInputValue) => setPriorityValue(newInputValue)}
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
              <Input
                value={effortValue}
                onChange={handleEffortValue}
              />
              <DetailItemTitle>
                Remaining Work
              </DetailItemTitle>
              <Input
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
        <Stack>
          <Typography>
            Build
          </Typography>
          <Typography>
            Found in Build
          </Typography>
          <Typography>
            Integrated in Build
          </Typography>
        </Stack>
      </Grid>
      {/* right column */}
      <Grid item md={3} xs={12}>
        <Stack>
          <Typography>
            Deployment
          </Typography>
        </Stack>
        <Stack>
          <Typography>
            Development
          </Typography>
        </Stack>
        <Stack>
          <Typography>
            Related Work
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  </Grid >
}
