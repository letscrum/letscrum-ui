import React from 'react'
import { PestControl, ErrorOutlined, ContactMailOutlined, ClearOutlined, AccountCircle } from '@mui/icons-material'
import { Autocomplete, Avatar, Box, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material'
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

export const ItemDetailPageTitle: React.FC = () => {
  const members = useAppSelector(selectProjectMembers)
  return <Grid>
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
            getOptionLabel={(option: any) => option.userName }
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
      </Grid>
    </Stack>
  </Grid>
}
