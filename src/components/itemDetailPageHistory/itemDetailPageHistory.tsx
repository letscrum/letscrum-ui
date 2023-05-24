import React, { useState } from 'react'
import { Box, Stack, Typography, Divider } from '@mui/material'
import { blue, grey } from '@mui/material/colors'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
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

const ShowEditorIcon = styled(ExpandLess)({
  marginLeft: '.125rem',
  width: '.875rem',
  height: '.875rem',
  color: grey[800],
  '&:hover': {
    color: blue[700],
    cursor: 'pointer'
  }
})

const CloseEditorIcon = styled(ExpandMore)({
  marginLeft: '.125rem',
  width: '.875rem',
  height: '.875rem',
  color: grey[800],
  '&:hover': {
    color: blue[700],
    cursor: 'pointer'
  }
})

export const ItemDetailPageHistory = (): JSX.Element => {
  const [showState, setShowState] = useState(true)
  const handleShowState = (): void => setShowState(!showState)
  return <Box paddingRight='.5rem'>
    {/* state grahpy */}
    <DetailItemContainer>
      <ItemTitleContainer direction='row' >
        <ItemTitleText>
          State Graphy
        </ItemTitleText>
        <ItemTitleOption>
          {
            showState
              ? <ShowEditorIcon onClick={handleShowState} />
              : <CloseEditorIcon onClick={handleShowState} />
          }
        </ItemTitleOption>
      </ItemTitleContainer>
      <Divider sx={{ marginBottom: '.25rem' }} />
      {
        showState && <Stack height='3rem' />
      }
    </DetailItemContainer>
    {/* history */}
    <DetailItemContainer>
      <ItemTitleContainer direction='row' >
        <ItemTitleText>
          History
        </ItemTitleText>
      </ItemTitleContainer>
      <Divider sx={{ marginBottom: '.25rem' }} />
    </DetailItemContainer>
  </Box>
}
