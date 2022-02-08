import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import {
    Box, Typography, Button, Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ChangeEventHandler, useState } from 'react';
import { useRouter } from 'next/router';
import Link from '../../src/components/common/Link';
import PasswordField from '../../src/components/common/PasswordField';
import Helmet from '../../src/components/common/Helmet';
import StyledTextField from '../../src/components/common/StyledTextField';
import { createUser } from '../../src/api/user';

type FormType = {
    email: string,
    username: string,
    password: string,
}

const Signup: NextPage = () => {
    const router = useRouter()
    const [form, setFormType] = useState({ email: '', username: '', password: '' } as FormType)
    const [confirmPassword, setConfirm] = useState('')
    const [error, setError] = useState({
        email: false, username: false, password: false, confirm: false,
    } as {
        email: boolean,
        username: boolean,
        password: boolean,
        confirm: boolean
    })
    const [loading, setLoading] = useState(false)

    const handleCreate = (): void => {
        // TODO: insert api stuff here
        createUser(form.username, form.email, form.password)
        router.push('/signup/success')
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
                    <Typography variant="h3" sx={{ mb: 3 }}>
                        Create Account
                    </Typography>
                    <Stack>
                        <StyledTextField
                            label="Email"
                            variant="outlined"
                            margin="dense"
                            size="small"
                            onChange={emailChange}
                        />
                        <StyledTextField
                            label="Username"
                            variant="outlined"
                            margin="dense"
                            size="small"
                            helperText="Use up to 20 characters with a mix of letters,
                                    numbers, periods, dashes, and underscores"
                            onChange={usernameChange}
                        />
                        <PasswordField
                            label="Password"
                            helperText="Use 8-25 characters with a mix of letters, numbers, and symbols"
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
                            disabled={form.username === '' || form.email === ''
                            || confirmPassword === '' || form.password !== confirmPassword}
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
