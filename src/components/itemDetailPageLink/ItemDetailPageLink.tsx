import React from 'react'
import { Box, Stack, Typography, Grid, Divider } from '@mui/material'
import { OpenInFull } from '@mui/icons-material'
import { blue, grey } from '@mui/material/colors'
import styled from '@emotion/styled'

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

export const ItemDetailPageLink = (): JSX.Element => {
  return <Box paddingRight='.5rem' height='21rem' sx={{ overflowY: 'auto' }}>
  <Grid container>
    {/* links */}
    <Grid item xs={12}>
      <DetailItemContainer>
        <ItemTitleContainer direction='row' >
          <ItemTitleText>
            Links
          </ItemTitleText>
          <ItemTitleOption>
          <FullScreenIcon />
          </ItemTitleOption>
        </ItemTitleContainer>
        <Divider sx={{ marginBottom: '.25rem' }} />
      </DetailItemContainer>
    </Grid>
  </Grid>
</Box>
}
