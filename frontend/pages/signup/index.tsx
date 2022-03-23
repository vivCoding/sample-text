import type { NextPage } from 'next';
import {
    Box, Typography, Button, Stack, LinearProgress, Alert, AlertTitle, Paper, Container, CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ChangeEventHandler, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Link from '../../src/components/common/Link';
import PasswordField from '../../src/components/common/PasswordField';
import Helmet from '../../src/components/common/Helmet';
import StyledTextField from '../../src/components/common/StyledTextField';
import { createUser, getUser } from '../../src/api/user';
import Navbar from '../../src/components/navbar';
import { setCurrentUser } from '../../src/store';
import { UserType } from '../../src/types/user';
import { getAccount } from '../../src/api/user/account';

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
    const dispatch = useDispatch()
    const [form, setFormType] = useState({ email: '', username: '', password: '' } as FormType)
    const [confirmPassword, setConfirm] = useState('')
    const [error, setError] = useState({
        email: '', username: '', password: '', server: '',
    } as ErrorFormType)
    const [loadingSignup, setLoadingSignup] = useState(false)

    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getUser().then((res) => {
            if (res.success && res.data) {
                dispatch(setCurrentUser(res.data))
                router.push('/timeline')
            }
            setLoading(false)
        })
    }, [router])

    if (loading) {
        return (
            // TODO move to component
            <Box>
                <Helmet title="Sign Up" />
                <Navbar />
                <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90vh',
                }}
                >
                    <CircularProgress />
                </Box>
            </Box>
        )
    }

    const handleCreate = (): void => {
        setLoadingSignup(true)
        setError({
            email: '', username: '', password: '', server: '',
        })
        createUser(form.username, form.email, form.password).then((res) => {
            if (res.success) {
                dispatch(setCurrentUser(res.data as UserType))
                router.push('/signup/success')
            } else {
                setError(res.data as ErrorFormType)
            }
            setLoadingSignup(false)
        })
    }
    const emailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormType({ ...form, email: e.target.value })
    }
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
        <Box>
            <Helmet title="Sign Up" />
            <Navbar />
            <Container maxWidth="md" sx={{ mt: '15vh', mb: 20 }}>
                <Paper
                    variant="outlined"
                    sx={{
                        width: '55vw', maxWidth: '450px', ml: 'auto', mr: 'auto', textAlign: 'center',
                    }}
                >
                    {loadingSignup && <LinearProgress /> }
                    <Box sx={{ p: 4, pt: 6 }}>
                        <Typography variant="h3" sx={{ mb: 4 }}>
                            Sign Up
                        </Typography>
                        {error.server !== ''
                                && (
                                    <Alert severity="error" sx={{ textAlign: 'left' }}>
                                        <AlertTitle>Server Error</AlertTitle>
                                        There was an error signing you up.
                                        <br />
                                        Try again later!
                                    </Alert>
                                )}
                        <Stack sx={{ mt: 2 }}>
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
                                margin="dense"
                                size="small"
                                helperText={(error.password === ''
                                    ? 'Use 8-25 characters with a mix of letters, numbers, and symbols'
                                    : error.password)}
                                onChange={passwordChange}
                                sx={{ mt: 2 }}
                            />
                            <PasswordField
                                label="Confirm Password"
                                margin="dense"
                                size="small"
                                onChange={confirmChange}
                                error={confirmPassword !== '' && form.password !== confirmPassword}
                            />
                        </Stack>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', alignContent: 'space-between', width: '100%',
                        }}
                        >
                            <Button variant="text" component={Link} noLinkStyle href="/login">Login instead</Button>
                            <LoadingButton
                                variant="contained"
                                sx={{ my: 2, ml: 'auto' }}
                                onClick={handleCreate}
                                disabled={form.username === '' || form.email === '' || confirmPassword === '' || form.password !== confirmPassword}
                                loading={loadingSignup}
                            >
                                Confirm
                            </LoadingButton>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}
export default Signup
