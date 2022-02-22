import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import {
    Box, Typography, Button, LinearProgress, Alert, AlertTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ChangeEventHandler, useState } from 'react';
import { useRouter } from 'next/router';
import LoginIcon from '@mui/icons-material/Login';
import Link from '../../src/components/common/Link';
import PasswordField from '../../src/components/common/PasswordField';
import Helmet from '../../src/components/common/Helmet';
import StyledTextField from '../../src/components/common/StyledTextField';
import Navbar from '../../src/components/navbar';

const Login: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [loginField, setLoginField] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = (): void => {
        setLoading(true)
        // TODO: call api function
        router.push('/profile/insert_username')
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
            <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '90vh', justifyContent: 'center',
            }}
            >
                <Typography variant="h3">
                    Login
                </Typography>
                <Box sx={{ width: '45vw', maxWidth: '350px', mt: 3 }}>
                    <Box sx={{ mb: 1 }}>
                        {loading && <LinearProgress />}
                        {error !== ''
                            && (
                                <Alert severity="error" sx={{ textAlign: 'left' }}>
                                    <AlertTitle>Error</AlertTitle>
                                    There was an error logging you in.
                                </Alert>
                            )}
                    </Box>
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
            </Box>
        </Box>
    )
}
export default Login
