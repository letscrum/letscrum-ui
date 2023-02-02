import React from 'react'
import { Box, Typography } from '@mui/material'
import { ListOptionsBar } from '../../components'

export const WorkItemsPage: React.FunctionComponent = () => {
  return (
    <Box padding='1rem'>
      <Typography sx={{ marginLeft: '.5rem', fontSize: '1.125rem', fontWeight: 'light' }}>
        Work items
      </Typography>
      <ListOptionsBar />
    </Box>
  )
}
