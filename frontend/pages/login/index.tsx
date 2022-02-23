import type { NextPage } from 'next';
import {
    Box, Typography, Button, LinearProgress, Alert, AlertTitle, Paper, Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ChangeEventHandler, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Link from '../../src/components/common/Link';
import PasswordField from '../../src/components/common/PasswordField';
import Helmet from '../../src/components/common/Helmet';
import StyledTextField from '../../src/components/common/StyledTextField';
import Navbar from '../../src/components/navbar';
import { setCurrentUser } from '../../src/store';
import { useUserAccount } from '../../src/api/user/hooks';
import { loginUser } from '../../src/api/user';

const Login: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [loginField, setLoginField] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')

    const dispatch = useDispatch()
    const { auth } = useUserAccount()

    if (auth) {
        router.push('/timeline')
    }

    const handleLogin = (): void => {
        setLoading(true)
        loginUser(loginField, password).then((res) => {
            if (res.success && res.data !== undefined) {
                dispatch(setCurrentUser(res.data))
                router.push('/timeline')
            } else {
                setLoginError(res.errorMessage ?? 'Error!')
                setLoading(false)
            }
        })
    }

    const loginFieldChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setLoginField(e.target.value)
    }
    const passwordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.target.value)
    }

    return (
        <Box>
            <Helmet title="Login" />
            <Navbar />
            <Container maxWidth="md" sx={{ mt: '15vh', mb: 20 }}>
                <Paper
                    variant="outlined"
                    sx={{
                        width: '55vw', maxWidth: '450px', ml: 'auto', mr: 'auto', textAlign: 'center',
                    }}
                >
                    {loading && <LinearProgress />}
                    <Box sx={{ p: 4, pt: 6 }}>
                        <Typography variant="h3" sx={{ mb: 4 }}>
                            Login
                        </Typography>
                        {loginError !== ''
                        && (
                            <Alert severity="error" sx={{ textAlign: 'left', mb: 2 }}>
                                <AlertTitle>Error</AlertTitle>
                                {loginError}
                            </Alert>
                        )}
                        <StyledTextField
                            label="Username or Email"
                            variant="outlined"
                            onChange={loginFieldChange}
                            margin="normal"
                        />
                        <PasswordField
                            label="Password"
                            onChange={passwordChange}
                            margin="dense"
                        />
                        <Box sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mt: 2,
                        }}
                        >
                            <Button variant="text" component={Link} noLinkStyle href="/signup">Sign Up</Button>
                            <LoadingButton
                                variant="contained"
                                onClick={handleLogin}
                                disabled={loginField === '' || password === ''}
                            >
                                Login
                            </LoadingButton>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}
export default Login
