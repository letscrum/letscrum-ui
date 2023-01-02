import React from 'react'
import { Box } from '@mui/system'
import { grey } from '@mui/material/colors'
import styled from '@emotion/styled'
import { Typography } from '@mui/material'

const Wrapper = styled(Box)({
  width: '100%',
  backgroundColor: grey[100],
  padding: '1rem 1.5rem'
})
export const ProjectWorkItemsPage: React.FunctionComponent = () => {
  return (
    <Wrapper>
      <Typography>
        My work items
      </Typography>
    </Wrapper>
  )
}
