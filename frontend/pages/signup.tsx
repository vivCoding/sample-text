import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import {
    Box, Typography, Button, Stack, styled, TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ChangeEventHandler, useState } from 'react';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Link from '../src/components/common/Link';
import PasswordField from '../src/components/common/PasswordField';

const StyledTextfield = styled(TextField)({
    width: '350px',
    maxWidth: '30vw',
})

type FormType = {
    email?: string,
    username?: string,
    password?: string,
}

const Signup: NextPage = () => {
    const [form, setFormType] = useState({} as FormType)
    const [confirmPassword, setConfirm] = useState('')
    const [showNext, setShowNext] = useState(false)

    const handleCreate = (): void => setShowNext(true)
    const handleFinish = () => {}

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
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1">
                    SAMPLE Text
                </Typography>
                <Typography variant="h6">
                    Simple Social Platform for Everyone
                </Typography>
                <Stack alignItems="center" sx={{ mt: 6 }}>
                    <Box alignItems="center" sx={{ width: '350px' }}>
                        <Stack>
                            {!showNext ? (
                                <>
                                    <Typography variant="h3" sx={{ mb: 3 }}>
                                        Create Account
                                    </Typography>
                                    <StyledTextfield
                                        label="Email"
                                        variant="outlined"
                                        margin="dense"
                                        size="small"
                                        onChange={emailChange}
                                    />
                                    <StyledTextfield
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
                                </>
                            ) : (
                                <>
                                    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
                                        <Typography variant="h3" fontWeight="300" sx={{ mr: 1 }}>
                                            Success!
                                        </Typography>
                                        <CheckCircleOutlinedIcon sx={{ fontSize: 50, color: 'green' }} />
                                    </Stack>
                                    <Typography variant="h6" fontWeight="300" sx={{ mb: 2 }}>
                                        Personalize your profile a little more!
                                    </Typography>
                                    <StyledTextfield
                                        label="Name"
                                        variant="outlined"
                                        margin="dense"
                                        size="medium"
                                    />
                                    <StyledTextfield
                                        label="Bio"
                                        variant="outlined"
                                        margin="dense"
                                        size="medium"
                                    />
                                </>
                            ) }
                        </Stack>
                        <Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'space-between' }}>
                            {!showNext ? (
                                <>
                                    {' '}
                                    <Button variant="text" component={Link} noLinkStyle href="/">Login instead</Button>
                                    <LoadingButton
                                        variant="contained"
                                        sx={{ my: 2, ml: 'auto' }}
                                        onClick={handleCreate}
                                    >
                                        Create
                                    </LoadingButton>
                                </>
                            ) : (
                                <>
                                    <Button variant="text" component={Link} noLinkStyle href="/">Skip for Now</Button>
                                    <LoadingButton
                                        variant="contained"
                                        sx={{ my: 2, ml: 'auto' }}
                                        onClick={handleFinish}
                                    >
                                        Finish
                                    </LoadingButton>
                                </>
                            )}
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </Container>
    )
}
export default Signup
