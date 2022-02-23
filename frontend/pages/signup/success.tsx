import type { NextPage } from 'next';
import {
    Box, Typography, Button, Stack, styled, LinearProgress, Alert, AlertTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState, ChangeEventHandler } from 'react';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useRouter } from 'next/router';
import CheckIcon from '@mui/icons-material/Check';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Helmet from '../../src/components/common/Helmet';
import StyledTextField from '../../src/components/common/StyledTextField';
import ProfileAvatar from '../../src/components/common/ProfileAvatar'
import ImageUpload from '../../src/components/common/ImageUpload'
import UserNavbar from '../../src/components/navbar/user';

import 'react-toastify/dist/ReactToastify.min.css'
import { LENGTH_LIMIT } from '../../src/constants/formLimit';
import { ReduxStoreType } from '../../src/types/redux';
import { setCurrentProfile } from '../../src/store';

const Input = styled('input')({
    display: 'none',
});

const SignupSuccess: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [pfp, setPfp] = useState('')

    const { username, email } = useSelector((state: ReduxStoreType) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        toast.success(`Welcome to SAMPLE Text, ${username}!`, {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
            position: toast.POSITION.BOTTOM_RIGHT,
        })
    }, [])

    const handleSetName: ChangeEventHandler<HTMLInputElement> = (e) => {
        setName(e.target.value)
    }
    const handleSetBio: ChangeEventHandler<HTMLInputElement> = (e) => {
        setBio(e.target.value)
    }
    const handleSetPfp = (image64: string): void => {
        setPfp(image64)
    }

    const handleFinish = (): void => {
        // TODO: call api function update user profile
        setLoading(true)
        router.push('/profile')
        if (username && email) {
            dispatch(setCurrentProfile({ name, bio, pfp }))
        }
    }

    const handleSkip = (): void => {
        setLoading(true)
        router.push('/profile')
    }

    return (
        <Box>
            <ToastContainer />
            <Helmet title="Sign Up" />
            <UserNavbar />
            <Box sx={{ height: '90vh', mt: 4 }}>
                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
                    <Typography variant="h3" fontWeight="300" sx={{ mr: 1 }}>
                        Success!
                    </Typography>
                    <CheckCircleOutlinedIcon sx={{ fontSize: 50, color: 'green' }} />
                </Stack>
                <Stack alignItems="center">
                    <Typography variant="h5" fontWeight="300">
                        Personalize your profile a little more,
                        {' '}
                        {username}
                        !
                    </Typography>
                    <Box sx={{ width: '45vw', maxWidth: '350px', mt: 3 }}>
                        <Box sx={{ mb: 3 }}>
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
                            <ProfileAvatar size={75} sx={{ mb: 1 }} picture64={pfp} />
                            <ImageUpload text="Add Profile Picture" onImageChange={handleSetPfp} />
                        </Stack>
                        <StyledTextField
                            label="Name"
                            variant="outlined"
                            margin="dense"
                            size="medium"
                            placeholder="Your display name"
                            onChange={handleSetName}
                            error={name.length > LENGTH_LIMIT.NAME}
                            helperText={name.length === 0 ? undefined : `Characters: ${name.length} / ${LENGTH_LIMIT.NAME}`}
                        />
                        <StyledTextField
                            label="Bio"
                            variant="outlined"
                            margin="dense"
                            size="medium"
                            placeholder="Something about yourself"
                            multiline
                            minRows={3}
                            onChange={handleSetBio}
                            error={bio.length > LENGTH_LIMIT.BIO}
                            helperText={bio.length === 0 ? undefined : `Characters: ${bio.length} / ${LENGTH_LIMIT.BIO}`}
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
                                disabled={name.length > LENGTH_LIMIT.NAME || bio.length > LENGTH_LIMIT.BIO}
                            >
                                Finish
                            </LoadingButton>
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}

export default SignupSuccess
