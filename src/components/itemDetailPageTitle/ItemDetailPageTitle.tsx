import { PestControl, ErrorOutlined } from '@mui/icons-material'
import { Grid, Stack, TextField, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import React from 'react'

export const ItemDetailPageTitle: React.FC = () => {
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
        height: '3rem',
        alignItems: 'center'
      }}
    >
      <TextField size='small' sx={{ width: '98%' }} />
    </Stack>
  </Grid>
}
