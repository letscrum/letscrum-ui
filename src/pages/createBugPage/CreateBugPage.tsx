import React from 'react'
import { ItemDetailPageDetail, ItemDetailPageHeader, ItemDetailPageTitle } from '../../components'
import { Box } from '@mui/material'

export const CreateBugPage: React.FunctionComponent = () => {
  return (
    <Box width='100%'>
      <ItemDetailPageHeader />
      <ItemDetailPageTitle />
      <ItemDetailPageDetail />
    </Box>
  )
}
