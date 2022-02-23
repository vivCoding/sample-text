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

const Login: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [loginField, setLoginField] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const dispatch = useDispatch()

    // TODO: use hook
    const handleLogin = (): void => {
        setLoading(true)
        // TODO: call api function
        router.push('/profile')
        dispatch(setCurrentUser({
            username: loginField,
            email: 'bob@gmail.com',
            name: 'bobby bob',
        }))
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
                        {error !== ''
                        && (
                            <Alert severity="error" sx={{ textAlign: 'left', mb: 2 }}>
                                <AlertTitle>Error</AlertTitle>
                                There was an error logging you in.
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
