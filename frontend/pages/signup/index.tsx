import type { NextPage } from 'next';
import {
    Box, Typography, Button, Stack, LinearProgress, Alert, AlertTitle, Paper, Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ChangeEventHandler, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Link from '../../src/components/common/Link';
import PasswordField from '../../src/components/common/PasswordField';
import Helmet from '../../src/components/common/Helmet';
import StyledTextField from '../../src/components/common/StyledTextField';
import { createUser } from '../../src/api/user';
import Navbar from '../../src/components/navbar';
import { setCurrentAccount } from '../../src/store';

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

    const dispatch = useDispatch()

    // TODO: use hook
    const handleCreate = (): void => {
        setLoading(true)
        setError({
            email: '', username: '', password: '', server: '',
        })
        createUser(form.username, form.email, form.password).then((res) => {
            // TODO: reset this
            // if (res.success) {
            dispatch(setCurrentAccount({ username: form.username, email: form.email }))
            router.push('/signup/success')
            setLoading(false)
            // } else {
            //     setError(res.data as ErrorFormType)
            //     setLoading(false)
            // }
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
                    {loading && <LinearProgress /> }
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
                                loading={loading}
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
