import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import {
    Box, Typography, Button, Stack, LinearProgress, Alert, AlertTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ChangeEventHandler, useState } from 'react';
import { useRouter } from 'next/router';
import Link from '../../src/components/common/Link';
import PasswordField from '../../src/components/common/PasswordField';
import Helmet from '../../src/components/common/Helmet';
import StyledTextField from '../../src/components/common/StyledTextField';

const Login: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [loginField, setLoginField] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = (): void => {
        setLoading(true)
    }

    const loginFieldChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setLoginField(e.target.value)
    }
    const passwordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.target.value)
    }

    return (
        <Container>
            <Helmet title="Login" />
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
                        <Button variant="text" component={Link} noLinkStyle href="/signup">Create Account</Button>
                        <LoadingButton variant="contained" onClick={handleLogin}>Login</LoadingButton>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}
export default Login
