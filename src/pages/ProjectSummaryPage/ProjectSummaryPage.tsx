import React, { useState } from 'react'
import { Box, Stack, Avatar, Typography, Button, IconButton, Divider, Grid, Paper, Link, Chip, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { StarOutline, Lock, GroupAdd, TrendingUp, Edit, Assignment, AssignmentTurnedIn, Commit } from '@mui/icons-material'
import { grey, red } from '@mui/material/colors'
import styled from '@emotion/styled'

const HeaderWrapper = styled(Stack)({
  position: 'sticky',
  zIndex: 1,
  top: 'calc(3rem + 1px)',
  padding: '1rem',
  backgroundColor: 'white'
})
const TitleText = styled(Typography)({
  lineHeight: '40px',
  marginLeft: '.5rem'
})
const PrivateButton = styled(Button)({
  marginLeft: 'auto',
  height: '2rem',
  backgroundColor: grey[100],
  color: grey[900],
  borderRadius: '2px',
  '&:hover': {
    backgroundColor: grey[200]
  }
})
const InviteButton = styled(Button)({
  marginLeft: '.5rem',
  height: '2rem',
  color: 'white',
  borderRadius: '2px'
})
const HeaderButtonText = styled(Typography)({
  marginLeft: '.5rem',
  fontSize: '.875rem'
})
const HeaderDivider = styled(Divider)({
  position: 'sticky',
  top: 'calc(7.5rem + 1px)',
  margin: 'auto',
  width: '98%'
})
const MainWrapper = styled(Box)({
  flexGrow: 1,
  backgroundColor: grey[100],
  padding: '1rem'
})
const ContentWrapper = styled(Paper)({
  padding: '2rem'
})
const MenuProps = {
  PaperProps: {
    style: {
      borderRadius: '2px'
    }
  }
}
const SelectItem = styled(MenuItem)({
  fontSize: '.75rem'
})
const WelcomeNavButton = styled(Button)({
  margin: '.5rem',
  height: '2rem',
  backgroundColor: grey[100],
  color: grey[900],
  borderRadius: '2px',
  '&:hover': {
    backgroundColor: grey[200]
  }
})
const ButtonText = styled(Typography)({
  marginLeft: '.5rem',
  color: grey[900],
  fontSize: '.875rem',
  fontWeight: '600'
})
const FavoriteButton = styled(IconButton)({
  marginLeft: '.5rem',
  height: '2rem',
  width: '2rem',
  '&:hover': {
    borderRadius: '2px'
  }
})
const AboutEditButton = styled(IconButton)({
  marginLeft: 'auto',
  height: '2rem',
  width: '2rem',
  '&:hover': {
    borderRadius: '2px'
  }
})
export const ProjectSummaryPage: React.FunctionComponent = () => {
  const [period, setPeriod] = useState('7')
  const handlePeriod = (e: SelectChangeEvent): void => setPeriod(e.target.value)
  return (
    <Box width='100%'>
      <Box width='calc(100wh - 16rem - 1px)'>
        <HeaderWrapper direction='row'>
          <Avatar variant='rounded'>T</Avatar>
          <TitleText variant='h6' >test create project</TitleText>
          <PrivateButton variant='contained' size='small' disableElevation >
            <Lock sx={{ fontSize: '1rem' }} />
            <HeaderButtonText>Private</HeaderButtonText>
          </PrivateButton>
          <InviteButton variant='contained' size='small' disableElevation>
            <GroupAdd sx={{ fontSize: '1rem' }} />
            <HeaderButtonText>Invite</HeaderButtonText>
          </InviteButton>
          <FavoriteButton>
            <StarOutline sx={{ fontSize: '1rem', color: 'brown' }} />
          </FavoriteButton>
        </HeaderWrapper>
        <HeaderDivider />
        {/* main content */}
        <MainWrapper>
          <Grid container spacing={2}>
            <Grid item md={12} lg={8} >
              {/* empty about */}
              <ContentWrapper>
                <Grid container sx={{ flexDirection: 'column', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                  <img src='project_overview_day_zero.IG7Dq6.png' alt='project_overview' style={{ width: '20rem' }} />
                  <Typography variant='h4' sx={{ marginTop: '2rem', fontWeight: 'bold' }}>
                    Welcome to the project!
                  </Typography>
                  <Typography variant='body2'>
                    What service would you like to start with?
                  </Typography>
                  <Grid container sx={{ display: 'flex', marginTop: '1rem', justifyContent: 'center', alignItems: 'center' }}>
                    <WelcomeNavButton variant='contained' size='small' disableElevation>
                      <ButtonText>
                        Boards
                      </ButtonText>
                    </WelcomeNavButton>
                    <WelcomeNavButton variant='contained' size='small' disableElevation>
                      <ButtonText>
                        Repos
                      </ButtonText>
                    </WelcomeNavButton>
                    <WelcomeNavButton variant='contained' size='small' disableElevation>
                      <ButtonText>
                        Pipelines
                      </ButtonText>
                    </WelcomeNavButton>
                    <WelcomeNavButton variant='contained' size='small' disableElevation>
                      <ButtonText>
                        Test Plans
                      </ButtonText>
                    </WelcomeNavButton>
                    <WelcomeNavButton variant='contained' size='small' disableElevation>
                      <ButtonText>
                        Artifacts
                      </ButtonText>
                    </WelcomeNavButton>
                  </Grid>
                  <Link sx={{ marginTop: '1rem', textDecoration: 'none', cursor: 'pointer' }}>or manage your services</Link>
                </Grid>
              </ContentWrapper>
              {/* about */}
              <ContentWrapper>
                <Stack direction='row' >
                  <Typography variant='h6' fontWeight='bold'>About this project</Typography>
                  <AboutEditButton>
                    <Edit sx={{ fontSize: '1rem' }} />
                  </AboutEditButton>
                </Stack>
                <Typography variant='body2' sx={{ marginTop: '2rem', marginBottom: '1rem' }}>Project description</Typography>
                <div style={{ width: '100%', padding: '1rem', backgroundColor: 'rgb(249, 235, 235)' }}>
                  <Typography variant='body2' sx={{ color: red[600], marginBottom: '.5rem' }}>We could not find Readme.md</Typography>
                  <Typography variant='body2'>Seems like the file has not been created or was deleted.</Typography>
                </div>
              </ContentWrapper>
            </Grid>
            <Grid item md={12} lg={4}>
              <ContentWrapper>
                {/* empty stats */}
                <Typography variant='h6' fontWeight='bold'>Project stats</Typography>
                <Grid container sx={{ flexDirection: 'column', my: '4rem', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '5rem', height: '5rem', backgroundColor: grey[100], borderRadius: '50%' }}>
                    <TrendingUp />
                  </div>
                  <Typography variant='body2' fontWeight='bold' marginTop='3rem'>No stats are available at this moment</Typography>
                  <Typography variant='body2' marginTop='1rem'>Setup a service to see project activity.</Typography>
                </Grid>
              </ContentWrapper>
              {/* stats */}
              <ContentWrapper>
                <Stack direction='row'>
                  <Typography variant='h6' fontWeight='bold'>Project stats</Typography>
                  {/* periods filter */}
                  <FormControl sx={{ ml: 'auto' }} size='small' >
                    <Select
                      value={period}
                      onChange={handlePeriod}
                      MenuProps={MenuProps}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      sx={{
                        backgroundColor: grey[200],
                        borderRadius: '2px',
                        fontSize: '.875rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: grey[200]
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: grey[200]
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: grey[200]
                        }
                      }}
                    >
                      <SelectItem value={'1'}>Last 1 day</SelectItem>
                      <SelectItem value={'7'}>Last 7 days</SelectItem>
                      <SelectItem value={'30'}>Last 30 day</SelectItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container>
                    <Grid item xs={12} paddingY='1rem'>
                      <Typography>Boards</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack direction='row' sx={{ display: 'flex', height: '4rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', marginRight: '1rem', width: '2rem', height: '2rem', justifyContent: 'center', alignItems: 'center', backgroundColor: grey[100], borderRadius: '2px' }}>
                          <Assignment sx={{ fontSize: '1rem' }} />
                        </div>
                        <Grid item xs={8}>
                          <Typography sx={{ fontSize: '.75rem' }}>0</Typography>
                          <Typography sx={{ fontSize: '.75rem' }}>Work items created</Typography>
                        </Grid>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                    <Stack direction='row' sx={{ display: 'flex', height: '4rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', marginRight: '1rem', width: '2rem', height: '2rem', justifyContent: 'center', alignItems: 'center', backgroundColor: grey[100], borderRadius: '2px' }}>
                          <AssignmentTurnedIn sx={{ fontSize: '1rem' }} />
                        </div>
                        <Grid item xs={8}>
                          <Typography sx={{ fontSize: '.75rem' }}>0</Typography>
                          <Typography sx={{ fontSize: '.75rem' }}>Work items completed</Typography>
                        </Grid>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} paddingY='1rem'>
                      <Typography>Repos</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack direction='row' sx={{ display: 'flex', height: '4rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', marginRight: '1rem', width: '2rem', height: '2rem', justifyContent: 'center', alignItems: 'center', backgroundColor: grey[100], borderRadius: '2px' }}>
                          <Commit sx={{ fontSize: '1rem' }} />
                        </div>
                        <Grid item xs={8}>
                          <Typography sx={{ fontSize: '.75rem' }}>0</Typography>
                          <Typography sx={{ fontSize: '.75rem' }}>Changesets by 0 authors</Typography>
                        </Grid>
                      </Stack>
                    </Grid>
                </Box>
              </ContentWrapper>
              {/* members */}
              <ContentWrapper sx={{ marginTop: '1rem' }}>
                <Stack direction='row'>
                  <Typography variant='h6' fontWeight='bold'>Members</Typography>
                  <Chip size='small' sx={{ marginTop: '.125rem', marginLeft: '.25rem', px: '.25rem', backgroundColor: grey[100] }} label='1' />
                </Stack>
                <Grid container>
                  <Avatar sx={{ width: '1.875rem', height: '1.875rem', marginTop: '1rem' }}>
                    <Typography variant='body2' color='white'>L</Typography></Avatar>
                </Grid>
              </ContentWrapper>
            </Grid>
          </Grid>
        </MainWrapper >
      </Box >
    </Box>
  )
}
