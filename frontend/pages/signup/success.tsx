import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { LoadingButton } from '@mui/lab';
import {
    Box, Button, LinearProgress, Stack, Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { editProfile } from '../../src/api/user/profile';
import Helmet from '../../src/components/common/Helmet';
import ImageUpload from '../../src/components/common/ImageUpload';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';
import StyledTextField from '../../src/components/common/StyledTextField';
import UserNavbar from '../../src/components/navbar/user';
import { LENGTH_LIMIT, PFP_LIMIT_MB } from '../../src/constants/formLimit';
import { TOAST_OPTIONS } from '../../src/constants/toast';
import { setCurrentProfile } from '../../src/store';
import { ReduxStoreType } from '../../src/types/redux';

const SignupSuccess: NextPage = () => {
    const router = useRouter()
    const [loadingEditing, setLoadingEditing] = useState(false)
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [profileImg, setProfileImg] = useState('')

    const {
        userId, username, posts, savedPosts, followedTopics, followers, following,
    } = useSelector((state: ReduxStoreType) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        toast.success(`Welcome to SAMPLE Text, ${username}!`, TOAST_OPTIONS)
    }, [username])

    const handleSetName: ChangeEventHandler<HTMLInputElement> = (e) => {
        setName(e.target.value)
    }
    const handleSetBio: ChangeEventHandler<HTMLInputElement> = (e) => {
        setBio(e.target.value)
    }
    const handleSetPfp = (image64: string): void => {
        setProfileImg(image64)
    }

    const handleFinish = (): void => {
        setLoadingEditing(true)
        editProfile({ name, bio, profileImg }).then((res) => {
            if (res.success && userId && username && posts && savedPosts && followedTopics && followers && following) {
                dispatch(setCurrentProfile({
                    userId, username, name, bio, profileImg, posts, savedPosts, followedTopics, followers, following,
                }))
                router.push(`/profile/${username}`)
            } else {
                toast.error(res.errorMessage ?? 'Error!', TOAST_OPTIONS)
            }
            setLoadingEditing(false)
        })
    }

    const handleSkip = (): void => {
        setLoadingEditing(true)
        router.push('/timeline')
    }

    return (
        <Box>
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
                    {/* TODO: use paper */}
                    <Box sx={{ width: '45vw', maxWidth: '350px', mt: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            {loadingEditing && <LinearProgress />}
                        </Box>
                        <Stack alignItems="center" sx={{ mb: 1.5 }}>
                            <ProfileAvatar size={75} sx={{ mb: 1 }} picture64={profileImg} />
                            <ImageUpload text="Add Profile Picture" onImageChange={handleSetPfp} sizeLimit={PFP_LIMIT_MB} />
                        </Stack>
                        <StyledTextField
                            label="Name"
                            variant="outlined"
                            margin="dense"
                            size="medium"
                            placeholder="Your display name"
                            onChange={handleSetName}
                            error={name.length > LENGTH_LIMIT.USER.NAME}
                            helperText={name.length === 0 ? undefined : `Characters: ${name.length} / ${LENGTH_LIMIT.USER.NAME}`}
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
                            error={bio.length > LENGTH_LIMIT.USER.BIO}
                            helperText={bio.length === 0 ? undefined : `Characters: ${bio.length} / ${LENGTH_LIMIT.USER.BIO}`}
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
                                loading={loadingEditing}
                                endIcon={<CheckIcon />}
                                disabled={name.length > LENGTH_LIMIT.USER.NAME || bio.length > LENGTH_LIMIT.USER.BIO}
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
