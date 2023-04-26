import React, { useState } from 'react'
import { PestControl, ErrorOutlined, ContactMailOutlined, ClearOutlined, AccountCircle, ForumOutlined, Clear, Add } from '@mui/icons-material'
import { Autocomplete, Avatar, Box, Button, Chip, Grid, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { blue, grey, red } from '@mui/material/colors'
import { useAppSelector } from '../../redux/hooks'
import { selectProjectMembers } from '../../redux/reducers/projectSlice'
import styled from '@emotion/styled'

const TitleInput = styled(TextField)({
  marginY: '.5rem',
  width: '98%',
  '& .MuiInputBase-root': {
    borderRadius: '0',
    height: '3rem',
    lineHeight: '3rem',
    color: grey[600]
  },
  '& .MuiInputBase-input': {
    padding: '0 0 0 .5rem'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'white'
    },
    '&:hover fieldset ': {
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: grey[200]
    },
    '& .Mui-focused fieldset': {
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: blue[600]
    }
  }
})

const CommentButton = styled(Button)({
  marginLeft: '.75rem',
  padding: '0',
  '&:hover': {
    backgroundColor: 'white',
    textDecoration: 'underline',
    textDecorationColor: grey[800]
  },
  '& .MuiButton-startIcon': {
    margin: '0 .25rem 0 0'
  }
})

const AddTagButton = styled(Button)({
  marginLeft: '.75rem',
  padding: '.125rem',
  backgroundColor: blue[50],
  borderRadius: '0',
  '&:hover': {
    backgroundColor: blue[100]
  }
})

const AddTag = styled(Autocomplete)({
  width: '10rem',
  '& .MuiInputBase-input': {
    padding: '0'
  },
  '& .MuiOutlinedInput-root': {
    '& .MuiAutocomplete-input': {
      padding: '0'
    }
  },
  '& .Mui-focused': {
    padding: '0 0 0 .125rem'
  }
})

const AddTagInput = styled(TextField)({
  marginLeft: '.75rem',
  height: '1.315rem',
  backgroundColor: blue[50],
  '& .MuiInputBase-input': {
    padding: '0 0 0 .125rem'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: '0',
      borderColor: grey[300]
    },
    '&:hover fieldset': {
      borderColor: grey[300]
    },
    '&.Mui-focused fieldset': {
      borderColor: grey[300]
    }
  }
})

export const ItemDetailPageTitle: React.FC = () => {
  const members = useAppSelector(selectProjectMembers)
  const [countComments, setCountComments] = useState(0)
  console.log(setCountComments)
  const [addFocus, setAddFocus] = useState<Boolean>(false)
  const tags = ['sports', 'art', 'math', 'science']
  const handleAddFocus = (): void => setAddFocus(true)
  const handleAddBlur = (): void => setAddFocus(false)
  const [selectedTag, setSelectedTag] = useState<any>('')
  const [selectedTagsArray, setSelectedTagsArray] = useState<string[]>([])
  return <Grid>
    {/* item type */}
    <Stack
      direction='row'
      sx={{
        borderLeftStyle: 'solid',
        borderLeftWidth: '10px',
        borderLeftColor: red[900],
        height: '1.5rem',
        alignItems: 'center'
      }}>
      <PestControl sx={{ marginLeft: '.75rem', color: red[900], fontSize: 'small' }} />
      <Typography variant='overline'>
        NEW BUG *
      </Typography>
      <ErrorOutlined sx={{ marginLeft: '.5rem', color: red[900], fontSize: 'small' }} />
      <Typography variant='body2' sx={{ marginLeft: '.25rem', color: red[900] }}>
        Field &lsquo;Title&lsquo; cannot be empty.
      </Typography>
    </Stack>
    {/* item title */}
    <Stack
      sx={{
        borderLeftStyle: 'solid',
        borderLeftWidth: '10px',
        borderLeftColor: red[900],
        height: '4rem',
        justifyContent: 'center'
      }}
    >
      <TitleInput hiddenLabel size='small' defaultValue='Enter Title' sx={{ marginLeft: '.75rem' }} />
    </Stack>
    {/* item general options */}
    <Stack
      sx={{
        borderLeftStyle: 'solid',
        borderLeftWidth: '10px',
        borderLeftColor: red[900],
        height: '3rem',
        alignItems: 'center'
      }}
    >
      <Grid container>
        {/* assign to Selector */}
        <Grid item>
          <Autocomplete
            sx={{
              marginLeft: '.75rem',
              '& .MuiInputBase-root': {
                borderRadius: '0'
              },
              '& .MuiOutlinedInput-root': {
                padding: '0',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: grey[200]
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: blue[600]
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: blue[600]
                },
                '& .MuiAutocomplete-input': {
                  padding: '.125rem'
                }
              }
            }}
            options={members}
            getOptionLabel={(option: any) => option.userName}
            renderOption={(props, option) => (
              <Box component='li' {...props} key={option.userId}>
                <Avatar sx={{ width: '2rem', height: '2rem' }}>
                  {(option.userName != null) ? option.userName[0].toUpperCase() : ''}
                </Avatar>
                <Stack sx={{ marginLeft: '.25rem' }}>
                  <Typography sx={{ fontSize: '.75rem' }}>
                    {option.userName}
                  </Typography>
                  <Typography sx={{ fontSize: '.75rem' }}>
                    {option.userId}
                  </Typography>
                </Stack>
                <ClearOutlined sx={{ marginLeft: 'auto', marginRight: '.25rem', fontSize: '1rem', color: red[700] }} />
                <ContactMailOutlined sx={{ fontSize: '1rem', color: grey[700] }} />
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountCircle />
                    </InputAdornment>
                  )
                }}
                sx={{
                  width: '18rem',
                  padding: '0',
                  '& .MuiInputBase-root': {
                    height: '1.5rem',
                    fontSize: '.75rem',
                    color: grey[600]
                  }
                }}
                hiddenLabel
                defaultValue='Unassigned'
              />
            )}
          />
        </Grid>
        {/* comments */}
        <Grid item direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={`Go to discussion. There are ${countComments} comments available (Ctrl+Shift+D)`}>
            <CommentButton startIcon={<ForumOutlined sx={{ fontSize: '.75rem', color: blue[700] }} />}>
              <Typography sx={{ fontSize: '.75rem', letterSpace: '.125', color: grey[800] }}>
                {countComments} comments
              </Typography>
            </CommentButton>
          </Tooltip>
          {
            addFocus === true
              ? <AddTag
                freeSolo
                openOnFocus
                value={selectedTag}
                onChange={(e, newValue: any) => {
                  setSelectedTag(newValue)
                  setSelectedTagsArray([
                    ...selectedTagsArray,
                    newValue
                  ])
                  setAddFocus(false)
                  setSelectedTag('')
                }}
                options={tags}
                getOptionLabel={(option: any) => option}
                renderOption={(props, option: any) => (
                  <Box component='li' {...props}>
                    <Typography variant='body2'>
                      {option}
                    </Typography>
                  </Box>
                )}
                renderInput={(params) => <AddTagInput
                  {...params}
                  onBlur={handleAddBlur}
                  autoFocus
                />}
              />
              : <AddTagButton onClick={handleAddFocus}>
                <Typography sx={{ fontSize: '.75rem', letterSpace: '.125', color: grey[600] }}>
                  Add tag
                </Typography>
              </AddTagButton>
          }
          {
            selectedTagsArray.map((tag, index) => (
              <Chip
                key={`${index}+${tag}`}
                label={tag}
                deleteIcon={<Clear sx={{ width: '.875rem', height: '.875rem' }} />}
                onDelete={() => setSelectedTagsArray(
                  selectedTagsArray.filter((t, i) => i !== index)
                )}
                sx={{
                  marginLeft: '.75rem',
                  height: '1.5rem',
                  backgroundColor: blue[50],
                  borderRadius: '0',
                  fontSize: '.75rem',
                  color: grey[800]
                }}
              />
            ))
          }
          <Tooltip title='Add tag'>
            <IconButton sx={{
              marginLeft: '.75rem',
              width: '1.5rem',
              height: '1.5rem',
              backgroundColor: blue[50],
              borderRadius: '0',
              '&:hover': {
                backgroundColor: blue[100]
              },
              '&:active': {
                backgroundColor: blue[800]
              }
            }}>
              <Add sx={{ width: '.875rem', height: '.875rem' }} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Stack>
  </Grid>
}
