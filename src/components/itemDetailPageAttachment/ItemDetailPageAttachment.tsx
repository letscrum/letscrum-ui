import React, { useState } from 'react'
import { Box, Stack, Typography, Grid, Divider, Button } from '@mui/material'
import { Add, AttachFileOutlined, ReorderOutlined, GridOnOutlined } from '@mui/icons-material'
import { blue, green, grey } from '@mui/material/colors'
import styled from '@emotion/styled'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

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

const rows: GridRowsProp = [
  { id: 1, name: '1.jpg', size: '147k', date: '27/5', comments: '' }
]

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'size', headerName: 'Size', width: 150 },
  { field: 'date', headerName: 'Date Attached', width: 150 },
  { field: 'comments', headerName: 'Comments', width: 150 }
]

export const ItemDetailPageAttachment = (): JSX.Element => {
  const [hasAttachment, setHasAttachment] = useState(false)
  const handleAddAttachment = (): void => setHasAttachment(true)

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
    {
      hasAttachment
        // attachment list
        ? <Stack sx={{ paddingLeft: '1rem' }}>
          <Stack direction='row'>
            <label htmlFor='add-attachment'>
              <input
                style={{ display: 'none' }}
                id='upload-attachment'
                name='add-attachment'
                type='file'
              />
              <Button
                component='span'
                sx={{
                  width: '8.125rem',
                  borderRadius: '0',
                  padding: '.125rem 0',
                  '&:hover': {
                    backgroundColor: blue[50]
                  },
                  '& .MuiButton-startIcon': {
                    margin: '0'
                  },
                  '& .MuiButton-endIcon': {
                    marginLeft: '.25rem',
                    paddingRight: '.25rem'
                  }
                }}
                startIcon={<Add sx={{ marginRight: '0', color: green[700] }} />}
                onClick={handleAddAttachment}
              >
                <Typography sx={{ color: grey[800], fontSize: '.75rem' }}>
                  Add attachment
                </Typography>
              </Button>
            </label>
            <ReorderOutlined sx={{ marginLeft: 'auto', color: blue[900] }} />
            <GridOnOutlined sx={{ marginLeft: '.5rem', color: grey[500] }} />
          </Stack>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
            />
          </div>
        </Stack>
        // empty attachment list
        : <Grid container direction='column' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <AttachFileOutlined sx={{ width: '6rem', height: '6rem', color: grey[500] }} />
          <Typography sx={{ paddingBottom: '1rem', fontSize: '.875rem', color: grey[700] }}>
            No attachments have been added
          </Typography>
          <label htmlFor='upload-attachment'>
            <input
              style={{ display: 'none' }}
              id='upload-attachment'
              name='upload-attachment'
              type='file'
            />
            <Button
              variant='contained'
              component='span'
              disableElevation
              onClick={handleAddAttachment}
              startIcon={<Add />}
              sx={{ borderRadius: '0' }}
            >
              Add attachment
            </Button>
          </label>
        </Grid>
    }

  </Box>
}
