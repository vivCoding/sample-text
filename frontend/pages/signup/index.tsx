import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import {
    Box, Typography, Button, Stack, LinearProgress, Alert, AlertTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from '../../src/components/common/Link';
import PasswordField from '../../src/components/common/PasswordField';
import Helmet from '../../src/components/common/Helmet';
import StyledTextField from '../../src/components/common/StyledTextField';
import { createUser } from '../../src/api/user';

interface FormType {
    email: string,
    username: string,
    password: string,
}

interface ErrorFormType extends FormType {
    server: string,
}

const Signup: NextPage = () => {
    const router = useRouter()
    const [form, setFormType] = useState({ email: '', username: '', password: '' } as FormType)
    const [confirmPassword, setConfirm] = useState('')
    const [error, setError] = useState({
        email: '', username: '', password: '', server: '',
    } as ErrorFormType)
    const [loading, setLoading] = useState(false)

    const handleCreate = (): void => {
        setLoading(true)
        setError({
            email: '', username: '', password: '', server: '',
        })
        createUser(form.username, form.email, form.password).then((res) => {
            console.log(res)
            if (res.success) {
                router.push('/signup/success')
                setLoading(false)
            } else {
                setError(res.data as ErrorFormType)
                setLoading(false)
            }
        })
    }
    const emailChange: ChangeEventHandler<HTMLInputElement> = (e) => setFormType({ ...form, email: e.target.value })
    const usernameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormType({ ...form, username: e.target.value })
    }
    const passwordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormType({ ...form, password: e.target.value })
    }
    const confirmChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setConfirm(e.target.value)
    }

    return (
        <Container sx={{ mt: 10 }}>
            <Helmet title="Sign Up" />
            <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            }}
            >
                <Typography variant="h1">
                    SAMPLE Text
                </Typography>
                <Typography variant="h6">
                    Simple Social Platform for Everyone
                </Typography>
                <Box alignItems="center" sx={{ width: '350px', mt: 6 }}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                        Create Account
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        {loading && <LinearProgress /> }
                        {error.server !== ''
                            && (
                                <Alert severity="error" sx={{ textAlign: 'left' }}>
                                    <AlertTitle>Server Error</AlertTitle>
                                    There was an error signing you up.
                                    <br />
                                    Try again later!
                                </Alert>
                            )}
                    </Box>
                    <Stack>
                        <StyledTextField
                            label="Email"
                            variant="outlined"
                            margin="dense"
                            size="small"
                            onChange={emailChange}
                            error={error.email !== ''}
                            helperText={(error.email === '' ? undefined : error.email)}
                        />
                        <StyledTextField
                            label="Username"
                            variant="outlined"
                            margin="dense"
                            size="small"
                            helperText={(error.username === ''
                                ? 'Use up to 20 characters with a mix of letters, numbers, periods, dashes, and underscores'
                                : error.username)}
                            error={error.username !== ''}
                            onChange={usernameChange}
                        />
                        <PasswordField
                            label="Password"
                            error={error.password !== ''}
                            helperText={(error.password === ''
                                ? 'Use 8-25 characters with a mix of letters, numbers, and symbols'
                                : error.password)}
                            onChange={passwordChange}
                        />
                        <PasswordField
                            label="Confirm Password"
                            onChange={confirmChange}
                            error={confirmPassword !== '' && form.password !== confirmPassword}
                        />
                    </Stack>
                    <Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'space-between' }}>
                        <Button variant="text" component={Link} noLinkStyle href="/">Login instead</Button>
                        <LoadingButton
                            variant="contained"
                            sx={{ my: 2, ml: 'auto' }}
                            onClick={handleCreate}
                            disabled={form.username === '' || form.email === '' || confirmPassword === '' || form.password !== confirmPassword}
                            loading={loading}
                        >
                            Create
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}
export default Signup
