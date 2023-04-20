import React, { useState } from 'react'
import { PestControl, ErrorOutlined, AccountCircle, ContactMailOutlined, ClearOutlined } from '@mui/icons-material'
import { Autocomplete, Avatar, Box, Grid, Stack, TextField, Typography } from '@mui/material'
import { grey, red } from '@mui/material/colors'
import { useAppSelector } from '../../redux/hooks'
import { selectProjectMembers } from '../../redux/reducers/projectSlice'

export const ItemDetailPageTitle: React.FC = () => {
  const members = useAppSelector(selectProjectMembers)
  const [selectMember, setSelectMember] = useState<any>(null)
  const [inputMember, setInputMember] = useState('')
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
      <PestControl sx={{ marginLeft: '.5rem', color: red[900], fontSize: 'small' }} />
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
        alignItems: 'center'
      }}
    >
      <TextField size='small' sx={{ marginY: '.5rem', width: '98%' }} />
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
          <AccountCircle sx={{ marginLeft: '.5rem', color: grey[700] }} />
        </Grid>
        <Grid item>
          <Autocomplete
            value={selectMember}
            onChange = {(e: any, newSelectMember: string) => {
              setSelectMember(newSelectMember)
            }}
            inputValue={inputMember}
            onInputChange={(e, newInputMember) => {
              setInputMember(newInputMember)
            }}
            options={members}
            getOptionLabel={(option) => option.userName}
            renderOption={(props, option) => (
              <Box component='li' {...props}>
                <Avatar sx={{ width: '2rem', height: '2rem' }}>A</Avatar>
                <Stack sx={{ marginLeft: '.25rem' }}>
                  <Typography>
                    {option.userName}
                  </Typography>
                  <Typography>
                    {option.userId}
                  </Typography>
                </Stack>
                <ClearOutlined sx={{ marginLeft: 'auto', marginRight: '.25rem', fontSize: '1rem', color: red[700] }}/>
                <ContactMailOutlined sx={{ fontSize: '1rem', color: grey[700] }} />
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps
                }}
                sx={{ width: '18rem', padding: '0' }}
                label=''
              />
            )}
          />
        </Grid>
      </Grid>
    </Stack>
  </Grid>
}
