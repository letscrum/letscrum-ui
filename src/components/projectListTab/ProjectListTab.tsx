import React, { useState } from 'react'
import { Box, Typography, Tab, Tabs, TextField, InputAdornment, Stack, Button } from '@mui/material'
import { grey } from '@mui/material/colors'
import styled from '@emotion/styled'
import { FilterAlt } from '@mui/icons-material'
import { useAppSelector } from '../../redux/hooks'
import { selectUserName } from '../../redux/reducers/userSlice'
import { useLocation, useNavigate } from 'react-router-dom'

const HeaderWrapper = styled(Stack)({
  width: '100%',
  height: '3rem',
  justifyContent: 'space-between',
  alignItems: 'center'
})
const HeaderTitle = styled(Typography)({
  lineHeight: '3rem',
  fontSize: '1.375rem',
  fontWeight: 500,
  color: grey[900]
})
const CreateProjectBtn = styled(Button)({
  height: '2rem',
  padding: '.2rem auto',
  borderRadius: '2px'
})
const ProjectTab = styled(Tab)({
  fontSize: '.75rem',
  color: grey[800],
  padding: 0,
  minWidth: 0,
  marginRight: '1rem',
  '& .MuiButtonBase-root': {
    '& .MuiTab-root': {
      '& .MuiTab-textColorPrimary': {
        '& .MuiTab-selected': {
          color: grey[900]
        }
      }
    }
  }
})
const FilterInput = styled(TextField)({
  marginLeft: 'auto',
  '& .MuiInputBase-root': {
    borderRadius: 2,
    backgroundColor: grey[300],
    padding: 1
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderStyle: 'none'
    }
  },
  '& .MuiInputAdornment-root': {
    width: '2rem',
    marginRight: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  '& .MuiSvgIcon-root': {
    fontSize: '.875rem',
    color: grey[500]
  },
  '& .MuiInputBase-input': {
    width: '12.5rem',
    padding: '2px 3px',
    height: '1.5rem',
    fontSize: '.875rem',
    fontWeight: '300',
    color: grey[900]
  }
})
// interface TabPanelProps {
//   children?: React.ReactNode
//   index: number
//   value: number
// }
// const TabPanel = (props: TabPanelProps): ReactElement => {
//   const { children, value, index, ...other } = props
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`${index}`}
//       aria-labelledby={`tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Typography component={'span'}>{children}</Typography>
//       )}
//     </div>
//   )
// }
const a11yProps = (index: number): { id: string, 'aria-controls': string } => {
  return {
    id: `${index}`,
    'aria-controls': `tabpanel-${index}`
  }
}
const tabPathMap: { [key: string]: number } = {
  '/': 0,
  '/_work': 1,
  '/_pulls': 2
}
export const ProjectListTab: React.FunctionComponent = () => {
  const name = useAppSelector(selectUserName)
  const path = useLocation().pathname
  const [currentValue, setCurrentValue] = useState(tabPathMap[path])
  const navigate = useNavigate()
  const handleChange = (event: React.SyntheticEvent, newValue: number): any => {
    setCurrentValue(newValue)
    switch (newValue) {
      case 0: {
        navigate('/')
        break
      }
      case 1: {
        navigate('/_work')
        break
      }
      case 2: {
        navigate('/_pulls')
        break
      }
    }
  }
  return (
    <Box width='calc(100wh - 16rem - 1px)'>
      <HeaderWrapper direction='row'>
        <HeaderTitle>
          {name}
        </HeaderTitle>
        {(currentValue === 0) && <CreateProjectBtn variant="contained">
          + New project
        </CreateProjectBtn>
        }
      </HeaderWrapper>
      <Stack direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
        <Tabs value={currentValue} onChange={handleChange}>
          <ProjectTab label="Projects" {...a11yProps(0)} />
          <ProjectTab label="My work items" {...a11yProps(1)} />
          <ProjectTab label="My pull requests" {...a11yProps(2)} />
        </Tabs>
        {(currentValue === 0) && <FilterInput
          placeholder="Filter projects"
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterAlt />
              </InputAdornment>
            )
          }}
        />
        }
      </Stack>
      {/* <TabPanel value={currentValue} index={0}>
        {currentValue}
      </TabPanel>
      <TabPanel value={currentValue} index={1}>
        {currentValue}
      </TabPanel>
      <TabPanel value={currentValue} index={2}>
        {currentValue}
      </TabPanel> */}
    </Box>
  )
}
