import React from 'react'
import styled from 'styled-components'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import { Typography } from '../atoms/Typography'
import { FETCH } from '../api/api'
import { endpoints } from '../api/endpoints'

const StyledWrapper = styled.div`
    display: grid;
    place-items: center;
    background-color: ${({ theme }) => theme.ligth};
    min-height: 100vh;
`

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 8px -3px black;
`

const StyledError = styled.p`
    color: ${({ theme }) => theme.error};
`

export const SignInPage = () => {
    const [sending, setSending] = React.useState(false)
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')

    const handleSubmitForm = (e) => {
        e.preventDefault()
        setSending(true)
        FETCH(endpoints.auth.signin, {
            username,
            password,
        })
            .then(() => {
                setSending(false)
            })
            .catch((err) => {
                setError(err)
                setSending(false)
            })
    }

    return (
        <StyledWrapper>
            <StyledForm onSubmit={handleSubmitForm}>
                <Typography variant={'h1'}>SIGN IN</Typography>
                <Input
                    value={username}
                    setValue={setUsername}
                    label={'USERNAME'}
                />
                <Input
                    value={password}
                    setValue={setPassword}
                    type="password"
                    label={'PASSWORD'}
                />
                {error && <StyledError>{error.toString()}</StyledError>}

                <Button loading={sending}>SIGN IN</Button>
            </StyledForm>
        </StyledWrapper>
    )
}