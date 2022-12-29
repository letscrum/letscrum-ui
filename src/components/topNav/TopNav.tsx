import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Stack, Breadcrumbs, Link, Typography, TextField, InputAdornment, Avatar } from '@mui/material'
import { LinkProps } from '@mui/material/Link'
import { SearchOutlined, PlaylistAddCheckOutlined, HelpOutlineOutlined, ManageAccountsOutlined } from '@mui/icons-material'
import { deepPurple, grey, blue } from '@mui/material/colors'
import { useAppSelector } from '../../redux/hooks'
import { selectUserName } from '../../redux/reducers/userSlice'
import { Outlet, useNavigate, Link as RouterLink, useLocation, useParams } from 'react-router-dom'

const BreadcrumbItems = styled(Breadcrumbs)({
  '& .MuiBreadcrumbs-li': {
    padding: '0 .5rem',
    lineHeight: '3rem',
    fontWeight: '300',
    fontSize: '.875rem',
    color: grey[500]
  },
  '& .MuiBreadcrumbs-separator': {
    fontWeight: '300',
    color: grey[500]
  },
  '& .MuiTypography-root': {
    lineHeight: '2rem',
    fontSize: '.875rem',
    padding: 8,
    borderRadius: 2,
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: grey[100]
    },
    '&:active': {
      backgroundColor: grey[50]
    }
  }
})
const SearchInputTitle = styled('div')({
  width: 'auto',
  height: '2rem',
  color: grey[500],
  fontSize: '.875rem',
  fontWeight: '300',
  borderRadius: '2px',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: grey[500],
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: grey[500],
  borderLeftWidth: '1px',
  borderLeftStyle: 'solid',
  borderLeftColor: grey[500],
  padding: '0 .75rem'
})
const SearchInput = styled(TextField)({
  '& .MuiInputBase-root': {
    marginRight: '1rem',
    padding: 1
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: 2,
      borderColor: grey[500]
    },
    '&:hover fieldset': {
      borderColor: grey[500]
    },
    '&.Mui-focused fieldset': {
      borderWidth: 1,
      borderColor: grey[500]
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
    height: '1.75rem',
    fontSize: '.875rem',
    fontWeight: '300',
    color: grey[900],
    transition: 'width .3s',
    '&:focus': {
      width: '18.75rem'
    }
  }
})
const TopNavContainer = styled(Stack)({
  position: 'sticky',
  top: '0',
  zIndex: '1',
  height: '3rem',
  backgroundColor: 'white',
  justifyContent: 'space-between',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: grey[300]
})
const LogoContainer = styled('div')({
  display: 'flex',
  width: 'auto',
  color: blue[700],
  padding: '0 .5rem',
  lineHeight: '3rem',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: grey[100],
    color: grey[800],
    cursor: 'pointer'
  }
})
const SearchBarContainer = styled('div')({
  display: 'flex',
  width: 'auto',
  lineHeight: '3rem',
  justifyContent: 'center',
  alignItems: 'center'
})
const TopNavItem = styled('div')({
  display: 'flex',
  width: '3rem',
  lineHeight: '3rem',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: grey[100],
    cursor: 'pointer'
  }
})
interface LinkRouterProps extends LinkProps {
  to: string
  replace?: boolean
}
const LinkRouter = (props: LinkRouterProps): React.ReactElement => {
  return <Link {...props} component={RouterLink as any } sx={{ color: grey[500], fontWeight: 'medium' }} />
}
export const TopNav: React.FunctionComponent = () => {
  const { projectId } = useParams()
  const id = projectId ?? ''
  const breadcrumbNameMap: { [key: string]: string } = {
    [`/${id}`]: 'ProjectName',
    [`/${id}/dashboard`]: 'Dashboard'
  }
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)
  const [isFoucs, setIsFocus] = useState<boolean>(false)
  const name = useAppSelector(selectUserName)
  const displayLetter = name?.toString().toUpperCase().charAt(0)
  const navigate = useNavigate()
  return (
    <Box>
      <TopNavContainer direction='row'>
        <LogoContainer onClick={() => navigate('/')}>
          <Typography>
            LetScrum
          </Typography>
        </LogoContainer>
        {
          isFoucs ||
          <BreadcrumbItems aria-label="breadcrumb">
            {pathnames.map((value, index) => {
              const last: boolean = index === pathnames.length - 1
              const to = `/${pathnames.slice(0, index + 1).join('/')}`
              return (
                last
                  ? (
                    <Typography key={to}>
                      {breadcrumbNameMap[to]}
                    </Typography>
                    )
                  : (
                    <LinkRouter underline="hover" to={to} key={to}>
                      {breadcrumbNameMap[to]}
                    </LinkRouter>
                    )
              )
            })}
            {/* to HomePage */}
            {/* <LinkRouter underline='hover' color='inherit' to='/'>Home</LinkRouter> */}
            {/* <Link underline="hover" color="inherit" href="/">
              MUI
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/material-ui/getting-started/installation/"
            >
              Core
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/material-ui/getting-started/installation/"
            >
              Breadcrumbs
            </Link> */}
          </BreadcrumbItems>
        }
        <SearchBarContainer sx={{ marginLeft: 'auto' }}>
          {isFoucs &&
            <SearchInputTitle>
              <Typography sx={{ textAlign: 'center', fontSize: '.875rem', lineHeight: '2rem' }}>
                This project
              </Typography>
            </SearchInputTitle>
          }
          <SearchInput
            placeholder="Search"
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
            onFocus={(e) => {
              e.target.placeholder = 'Tpye / for a list of filters'
              setIsFocus(!isFoucs)
            }}
            onBlur={(e) => {
              e.target.placeholder = 'Search'
              setIsFocus(!isFoucs)
            }}
          />
        </SearchBarContainer>
        <TopNavItem>
          <PlaylistAddCheckOutlined sx={{ fontSize: '1rem', color: grey[500] }} />
        </TopNavItem>
        <TopNavItem>
          <HelpOutlineOutlined sx={{ fontSize: '1rem', color: grey[500] }} />
        </TopNavItem>
        <TopNavItem>
          <ManageAccountsOutlined sx={{ fontSize: '1rem', color: grey[500] }} />
        </TopNavItem>
        <TopNavItem>
          <Avatar sx={{ bgcolor: deepPurple[500], width: '1.875rem', height: '1.875rem', fontSize: '.875rem', fontWeight: '300' }}>
            {displayLetter}
          </Avatar>
        </TopNavItem>
      </TopNavContainer>
      <Outlet />
    </Box>
  )
}
