import React from 'react'
import { Box, Stack, Typography, Grid, Divider } from '@mui/material'
import { blue } from '@mui/material/colors'
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

export const ItemDetailPageAttachment = (): JSX.Element => {
  return <Box paddingRight='.5rem' height='21rem' sx={{ overflowY: 'auto' }}>
  <Grid container>
    {/* links */}
    <Grid item xs={12}>
      <DetailItemContainer>
        <ItemTitleContainer direction='row' >
          <ItemTitleText>
            Attachment
          </ItemTitleText>
          <ItemTitleOption>
          </ItemTitleOption>
        </ItemTitleContainer>
        <Divider sx={{ marginBottom: '.25rem' }} />
      </DetailItemContainer>
    </Grid>
  </Grid>
</Box>
}
