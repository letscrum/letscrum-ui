import React, { useState, ChangeEvent } from 'react'
import { Box, TextField, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { userSignIn, selectUserLoading, selectUserError } from '../../redux/reducers/userSlice'
import { useNavigate } from 'react-router-dom'
import { Stack } from '@mui/system'
import styled from '@emotion/styled'

const InputContainer = styled(Stack)({
  width: '20rem',
  padding: '2rem 0 0 0'
})
const SubmitContainer = styled(Stack)({
  width: '20rem',
  padding: '6rem 0 0 0'
})
export const SignInForm: React.FunctionComponent = () => {
  const [inputName, setInputName] = useState<string | null>(null)
  const [inputPwd, setInputPwd] = useState<string>('')
  const loading = useAppSelector(selectUserLoading)
  const error = useAppSelector(selectUserError)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target.value
    switch (e.target.id) {
      case 'name': {
        setInputName(input)
        break
      }
      case 'password': {
        setInputPwd(input)
        break
      }
    }
  }
  const handleSignIn = (): void => {
    dispatch(userSignIn({ inputName, inputPwd }))
      .then(() => {
        navigate('/')
      })
      .catch(() => {
        error ?? alert(error)
      })
  }
  return (
    <Box>
      {
        loading
          ? <>
            <InputContainer>
              <TextField
                required
                name="name"
                label="Enter your nanme"
                variant="standard"
                defaultValue={inputName}
                disabled
              />
            </InputContainer>
            <InputContainer>
              <TextField
                required
                name="password"
                label="Enter password"
                type="password"
                variant="standard"
                defaultValue={inputPwd}
                disabled
              />
            </InputContainer>
            <SubmitContainer>
              <Button variant="contained" onClick={handleSignIn} disabled>
                Submit
              </Button>
            </SubmitContainer>
          </>
          : <>
            <InputContainer>
              <TextField
                required
                id="name"
                label="Enter your name"
                variant="standard"
                onChange={handleChange}
              />
            </InputContainer>
            <InputContainer>
              <TextField
                required
                id="password"
                label="Enter password"
                type="password"
                variant="standard"
                onChange={handleChange}
              />
            </InputContainer>
            <SubmitContainer>
              <Button variant="contained" onClick={handleSignIn}>
                Submit
              </Button>
            </SubmitContainer>
          </>
      }
    </Box>
  )
}
