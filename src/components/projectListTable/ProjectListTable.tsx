import React, { useEffect, useState } from 'react'
import { Stack, Card, CardContent, Typography, CardActions, Avatar, Paper, Divider, Skeleton } from '@mui/material'
import styled from '@emotion/styled'
import { FiberManualRecord, FactCheck, AccountTree, RocketLaunch, Science, Widgets } from '@mui/icons-material'
import { grey, red, teal, deepOrange, blue, deepPurple, pink, amber, cyan, green } from '@mui/material/colors'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import axios from 'axios'
import { useNavigate } from 'react-router'

export interface ProjectProps {
  id: string
  name: string
  displayName: string
  updatedAt: string
}
const LoadingCircular = styled(Skeleton)({
  height: '3rem',
  width: '3rem',
  margin: '1.5rem'
})
const LoadingRectangular = styled(Skeleton)({
  height: '12rem',
  width: '19rem',
  margin: '1.5rem 0 0 0',
  borderRadius: '3px'
})
const LoadingLongerRectangular = styled(Skeleton)({
  height: '12rem',
  width: '91%',
  margin: '1.5rem 0 1rem 0',
  borderRadius: '3px'
})
const HeadProjectsWrapper = styled(Stack)({
  width: '100%',
  padding: '1rem 0'
})
const HeadProjectCard = styled(Card)({
  minWidth: '12rem',
  height: '12rem',
  cursor: 'pointer'
})
const HeadCardContent = styled(CardContent)({
  height: '7rem'
})
const CardActionsWrapper = styled(CardActions)({
  display: 'flex',
  justifyContent: 'end'
})
const IconWrapper = styled('div')({
  display: 'flex',
  width: '2rem',
  height: '2rem',
  marginRight: '.125rem',
  justifyContent: 'center',
  alignItems: 'center'
})
const FiberManualRecordIcon = styled(FiberManualRecord)({
  color: grey[300],
  width: '.5rem',
  height: '.5rem'
})
const TailItemCardContent = styled(CardContent)({
  height: '4rem',
  padding: '1rem',
  '&:last-child': {
    paddingBottom: '1rem'
  }
})
const ProjectAvatarWrapper = styled(Grid)({
  width: '4rem'
})
const ProjectNameWrapper = styled(Grid)({
  width: 'auto'
})
const TailAvatarWrapper = styled(Grid)({
  width: '4rem',
  padding: '.5rem'
})
const TailNameWrapper = styled(Stack)({
  width: 'auto',
  padding: '.5rem'
})
const ProjectAvatar = styled(Avatar)({
  width: '3rem',
  height: '3rem'
})
const AvatarPalette = [grey[700], red[700], teal[700], deepOrange[700], blue[700], deepPurple[700], pink[700], amber[700], cyan[700], green[700]]
const PickAvatarColor = (id: string, colorSet: string[]): string => {
  const i = id.length
  const code = id[i - 1]
  const codeNumber = Number(code)
  const pickedColor = colorSet[codeNumber]
  return pickedColor
}
export const ProjectListTable = (props: { keyword: string, isEnter: boolean, isDone: boolean }): React.ReactElement => {
  const navigate = useNavigate()
  const [hoverId, setHoverId] = useState<string | null>(null)
  const handleMouseIn = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    setHoverId(e.currentTarget.id)
  }
  const handleMouseOut = (): void => setHoverId(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState<ProjectProps[]>([])
  const keyword = props.keyword
  const isEnter = props.isEnter
  const isDone = props.isDone
  let itemsHead: ProjectProps[] = []
  let itemsTail: ProjectProps[] = []
  const fetchProjectItems = async (
    params: {
      keyword: string
      isEnter: boolean
      isDone: boolean
    }
  ): Promise<ProjectProps[] | string> => {
    try {
      let response
      setLoading(true)
      console.log('loading: ', loading, 'isDone', params.isDone, 'isEnter', params.isEnter);
      (params.isDone || params.isEnter)
        ? response = await axios.get(`/v1/projects?keyword=${params.keyword}&page=1&size=10`)
        : response = await axios.get('/v1/projects?page=1&size=10')
      setLoading(false)
      console.log('list: ', response.data.items)
      setItems(response.data.items)
      return items
    } catch (e: any) {
      setLoading(false)
      setError(e.message)
      return error
    }
  }
  useEffect(() => {
    fetchProjectItems({ keyword, isEnter, isDone })
      .catch(() => alert(error))
  }, [isDone, isEnter])
  if (items.length > 3) {
    itemsHead = items.slice(0, 3)
    itemsTail = items.slice(3)
  }
  const handleToProject = (itemId: string): void => {
    const projectId = itemId
    navigate(`/${projectId}`)
  }
  return (
    <>
      <HeadProjectsWrapper direction='row'>
        <Grid container spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
          {
            loading
              ? <>
                <Stack direction='row'>
                  <Grid xs={4}>
                    <Stack direction='row'>
                      <LoadingCircular variant="circular" />
                      <LoadingRectangular variant="rectangular" animation="wave" />
                    </Stack>
                  </Grid>
                  <Grid xs={4}>
                    <Stack direction='row'>
                      <LoadingCircular variant="circular" />
                      <LoadingRectangular variant="rectangular" animation="wave" />
                    </Stack>
                  </Grid>
                  <Grid xs={4}>
                    <Stack direction='row'>
                      <LoadingCircular variant="circular" />
                      <LoadingRectangular variant="rectangular" animation="wave" />
                    </Stack>
                  </Grid>
                </Stack>
                <Grid xs={12}>
                  <Stack direction='row'>
                    <LoadingCircular variant="circular" />
                    <LoadingLongerRectangular variant="rectangular" animation="wave" />
                  </Stack>
                </Grid>
              </>
              : <>
                {
                  itemsHead.map((item) => {
                    return (
                      <Grid xs={12} md={4} key={item.id} onClick={() => handleToProject(item.id)}>
                        <HeadProjectCard>
                          <HeadCardContent>
                            <Stack direction='row'>
                              <ProjectAvatarWrapper>
                                <ProjectAvatar variant="rounded" sx={{ backgroundColor: PickAvatarColor(item.id, AvatarPalette) }}>
                                  {item.displayName?.toString().toUpperCase().charAt(0)}
                                </ProjectAvatar>
                              </ProjectAvatarWrapper>
                              <ProjectNameWrapper>
                                <Typography sx={{ fontSize: '1.125rem' }}>
                                  {item.name}
                                </Typography>
                                <Typography component={'span'} sx={{ color: grey[400] }}>
                                  {item.displayName}
                                </Typography>
                              </ProjectNameWrapper>
                            </Stack>
                          </HeadCardContent>
                          <CardActionsWrapper
                            id={item.id}
                            key={item.id}
                            onMouseEnter={handleMouseIn}
                            onMouseLeave={handleMouseOut}
                          >
                            {
                              // hover on Card
                              item.id === hoverId
                                ? <>
                                  <IconWrapper>
                                    <FactCheck sx={{ color: teal[500] }} />
                                  </IconWrapper>
                                  <IconWrapper>
                                    <AccountTree sx={{ color: deepOrange[700] }} />
                                  </IconWrapper>
                                  <IconWrapper>
                                    <RocketLaunch sx={{ color: blue[800] }} />
                                  </IconWrapper>
                                  <IconWrapper >
                                    <Science sx={{ color: deepPurple[600] }} />
                                  </IconWrapper>
                                  <IconWrapper>
                                    <Widgets sx={{ color: pink[500] }} />
                                  </IconWrapper>
                                </>
                                : <>
                                  <IconWrapper>
                                    <FiberManualRecordIcon />
                                  </IconWrapper>
                                  <IconWrapper>
                                    <FiberManualRecordIcon />
                                  </IconWrapper>
                                  <IconWrapper>
                                    <FiberManualRecordIcon />
                                  </IconWrapper>
                                  <IconWrapper>
                                    <FiberManualRecordIcon />
                                  </IconWrapper>
                                  <IconWrapper>
                                    <FiberManualRecordIcon />
                                  </IconWrapper>
                                </>
                            }
                          </CardActionsWrapper>
                        </HeadProjectCard>
                      </Grid>
                    )
                  })
                }
              </>
          }
        </Grid>
      </HeadProjectsWrapper>
      <Paper>
        {
          itemsTail.map((item) => {
            return (
              <div key={item.id}>
                <Stack direction='row' onClick={() => handleToProject(item.id)} sx={{ cursor: 'pointer' }}>
                  <TailItemCardContent>
                    <Stack direction='row'>
                      <TailAvatarWrapper>
                        <ProjectAvatar variant="rounded" sx={{ backgroundColor: PickAvatarColor(item.id, AvatarPalette) }}>
                          {item.displayName?.toString().toUpperCase().charAt(0)}
                        </ProjectAvatar>
                      </TailAvatarWrapper>
                      <TailNameWrapper>
                        <Typography component={'span'} sx={{ fontSize: '1.125rem' }}>
                          {item.name}
                        </Typography>
                        <Typography component={'span'} sx={{ color: grey[400] }}>
                          {item.displayName}
                        </Typography>
                      </TailNameWrapper>
                    </Stack>
                  </TailItemCardContent>
                  <CardActionsWrapper
                    sx={{ marginLeft: 'auto' }}
                    id={item.id}
                    onMouseEnter={handleMouseIn}
                    onMouseLeave={handleMouseOut}
                  >
                    {
                      // hover on Card
                      item.id === hoverId
                        ? <>
                          <IconWrapper>
                            <FactCheck sx={{ color: teal[500] }} />
                          </IconWrapper>
                          <IconWrapper>
                            <AccountTree sx={{ color: deepOrange[700] }} />
                          </IconWrapper>
                          <IconWrapper>
                            <RocketLaunch sx={{ color: blue[800] }} />
                          </IconWrapper>
                          <IconWrapper >
                            <Science sx={{ color: deepPurple[600] }} />
                          </IconWrapper>
                          <IconWrapper>
                            <Widgets sx={{ color: pink[500] }} />
                          </IconWrapper>
                        </>
                        : <>
                          <IconWrapper>
                            <FiberManualRecordIcon />
                          </IconWrapper>
                          <IconWrapper>
                            <FiberManualRecordIcon />
                          </IconWrapper>
                          <IconWrapper>
                            <FiberManualRecordIcon />
                          </IconWrapper>
                          <IconWrapper>
                            <FiberManualRecordIcon />
                          </IconWrapper>
                          <IconWrapper>
                            <FiberManualRecordIcon />
                          </IconWrapper>
                        </>
                    }
                  </CardActionsWrapper>
                </Stack>
                <Divider sx={{ borderColor: grey[100] }} />
              </div>
            )
          })
        }
      </Paper>
    </>
  )
}
