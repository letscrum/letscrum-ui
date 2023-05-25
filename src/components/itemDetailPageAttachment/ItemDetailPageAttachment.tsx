import React from 'react'
import { Box, Stack, Typography, Grid, Divider, Button } from '@mui/material'
import { Add, AttachFileOutlined } from '@mui/icons-material'
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

export const ItemDetailPageAttachment = (): JSX.Element => {
  const handleAddAttachment = (): void => {}
  return <Box paddingRight='.5rem' height='21rem' sx={{ overflowY: 'auto' }}>
    {/* attachment title */}
    <Stack>
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
    </Stack>
    {/* attachments */}
    <Grid container direction='column' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <AttachFileOutlined sx={{ width: '6rem', height: '6rem', color: grey[500] }} />
      <Typography sx={{ paddingBottom: '1rem', fontSize: '.875rem', color: grey[700] }}>
        No attachments have been added
      </Typography>
      <Button
        variant='contained'
        disableElevation
        onClick={handleAddAttachment}
        startIcon={<Add />}
        sx={{ borderRadius: '0' }}
      >
        Add attachment
      </Button>
    </Grid>
  </Box>
}
