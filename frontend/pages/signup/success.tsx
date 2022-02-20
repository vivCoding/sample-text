import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import {
    Box, Typography, Button, Stack, styled, LinearProgress, Alert, AlertTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useRouter } from 'next/router';
import CheckIcon from '@mui/icons-material/Check';
import { ToastContainer, toast } from 'react-toastify';
import Link from '../../src/components/common/Link';
import Helmet from '../../src/components/common/Helmet';
import StyledTextField from '../../src/components/common/StyledTextField';
import ProfileAvatar from '../../src/components/common/ProfileAvatar'
import UserNavbar from '../../src/components/navbar/user';

import 'react-toastify/dist/ReactToastify.min.css'

const Input = styled('input')({
    display: 'none',
});

const SignupSuccess: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        toast.success('Success in creating account!', {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
            position: toast.POSITION.BOTTOM_RIGHT,
        })
    }, [])

    const handleFinish = (): void => {
        // TODO: call api function update user profile
        setLoading(true)
        router.push('/profile/insert_username')
    }

    const handleSkip = (): void => {
        setLoading(true)
        router.push('/profile/insert_username')
    }

    return (
        <Container>
            <ToastContainer />
            <Helmet title="Sign Up" />
            <UserNavbar />
            <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '90vh', justifyContent: 'center',
            }}
            >
                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
                    <Typography variant="h3" fontWeight="300" sx={{ mr: 1 }}>
                        Success!
                    </Typography>
                    <CheckCircleOutlinedIcon sx={{ fontSize: 50, color: 'green' }} />
                </Stack>
                <Typography variant="h5" fontWeight="300">
                    Personalize your profile a little more
                </Typography>
                <Box sx={{ width: '45vw', maxWidth: '350px', mt: 3 }}>
                    <Box sx={{ mb: 4 }}>
                        {loading && <LinearProgress />}
                        {error && (
                            <Alert severity="error" sx={{ textAlign: 'left' }}>
                                <AlertTitle>Server Error</AlertTitle>
                                There was an error updating your profile.
                                <br />
                                Try again later!
                            </Alert>
                        )}
                    </Box>
                    <Stack alignItems="center" sx={{ mb: 1.5 }}>
                        <ProfileAvatar size={75} sx={{ mb: 1 }} />
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file" />
                            <Button variant="outlined" component="span">
                                Add Profile Picture
                            </Button>
                        </label>
                    </Stack>
                    <StyledTextField
                        label="Name"
                        variant="outlined"
                        margin="dense"
                        size="medium"
                        placeholder="Your display name"
                    />
                    <StyledTextField
                        label="Bio"
                        variant="outlined"
                        margin="dense"
                        size="medium"
                        placeholder="Something about yourself"
                        multiline
                        minRows={3}
                    />
                    <Box sx={{
                        display: 'flex', alignItems: 'center', alignContent: 'space-between', width: '100%',
                    }}
                    >
                        <Button variant="text" onClick={handleSkip}>Skip for Now</Button>
                        <LoadingButton
                            variant="contained"
                            sx={{ my: 2, ml: 'auto' }}
                            onClick={handleFinish}
                            loading={loading}
                            endIcon={<CheckIcon />}
                        >
                            Finish
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}

export default SignupSuccess
