import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button, Stack, Grid, Container, Paper, IconButton, Divider, LinearProgress, CircularProgress, Switch,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';
import ImageUpload from '../../src/components/common/ImageUpload';
import { ReduxStoreType } from '../../src/types/redux';
import {
    setCurrentAccount, setCurrentProfile, setCurrentUser,
} from '../../src/store';
import { LENGTH_LIMIT, PFP_LIMIT_MB } from '../../src/constants/formLimit';
import { updateEmail, updatePassword, updateUsername } from '../../src/api/user/account'
import FormRow from '../../src/components/settings/FormRow'

import 'react-toastify/dist/ReactToastify.min.css'
import { editProfile, updateMessageSetting } from '../../src/api/user/profile';
import { TOAST_OPTIONS } from '../../src/constants/toast';
import { deleteUser, getUser } from '../../src/api/user';
import PasswordField from '../../src/components/common/PasswordField';
import BackButton from '../../src/components/common/BackButton';

const Settings: NextPage = () => {
    const router = useRouter()

    const {
        username, email, name, bio, profileImg, messageSetting: messageSettingStore,
    } = useSelector((state: ReduxStoreType) => state.user)
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(username === undefined)
    useEffect(() => {
        if (!username) {
            getUser().then((res) => {
                if (res.success && res.data) {
                    dispatch(setCurrentUser(res.data))
                } else if (res.error === 401) {
                    router.push('/401')
                } else {
                    router.push('/404')
                }
                setLoading(false)
            })
        }
    }, [router, dispatch, username])

    const [changingProfileImg, setChangingProfileImg] = useState(false)
    const [currentProfileImg, setCurrentProfileImg] = useState(profileImg)

    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [messageSetting, setMessageSetting] = useState(messageSettingStore)

    const [changingPassword, setChangingPassword] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const [profileLoading, setProfileLoading] = useState(false)
    const [messageLoading, setMessageLoading] = useState(false)
    const [accountLoading, setAccountLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    const [deleting, setDeleting] = useState(false)
    const [confirmDeleting, setConfirmDeleting] = useState('')
    const [errorDeleting, setErrorDeleting] = useState('')
    const [loadingDelete, setLoadingDelete] = useState(false)

    const handleImageChange = (image64: string): void => {
        setCurrentProfileImg(image64)
        setChangingProfileImg(true)
    }

    const handleRemoveImage = (): void => {
        setCurrentProfileImg('')
        setChangingProfileImg(true)
    }

    const handleSaveProfileImg = (): void => {
        setProfileLoading(true)
        editProfile({ profileImg: currentProfileImg }).then((res) => {
            if (res.success && res.data) {
                dispatch(setCurrentProfile(res.data))
                setChangingProfileImg(false)
                toast.success('Successfully changed profile picture!', TOAST_OPTIONS)
            } else {
                toast.error(res.errorMessage ?? 'Error!', TOAST_OPTIONS)
            }
            setProfileLoading(false)
        })
    }

    const handleCancelPfpChange = (): void => {
        setCurrentProfileImg(profileImg)
        setChangingProfileImg(false)
    }

    const handleSaveName = async (val: string): Promise<boolean> => {
        setProfileLoading(true)
        const res = await editProfile({ name: val })
        setProfileLoading(false)
        if (res.success && res.data) {
            dispatch(setCurrentProfile(res.data))
            toast.success('Successfully changed display name!', TOAST_OPTIONS)
            return true
        }
        toast.error(res.errorMessage ?? 'Error!', TOAST_OPTIONS)
        return false
    }

    const handleSaveBio = async (val: string): Promise<boolean> => {
        setProfileLoading(true)
        const res = await editProfile({ bio: val })
        setProfileLoading(false)
        if (res.success && res.data) {
            dispatch(setCurrentProfile(res.data))
            toast.success('Successfully changed bio!', TOAST_OPTIONS)
            return true
        }
        toast.error(res.errorMessage ?? 'Error!', TOAST_OPTIONS)
        return false
    }

    const handleMessageSettingChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setMessageLoading(true)
        updateMessageSetting(!messageSetting).then((res) => {
            if (res.success) {
                setMessageSetting(!messageSetting)
                toast.success('Successfully changed DMs setting!', TOAST_OPTIONS)
            } else {
                toast.error(res.errorMessage ?? 'Error! Could not change DMs setting.', TOAST_OPTIONS)
            }
            setMessageLoading(false)
        })
    }

    const handleSaveUsername = async (val: string): Promise<boolean> => {
        setAccountLoading(true)
        const res = await updateUsername(val)
        setAccountLoading(false)
        if (res.success && res.data) {
            dispatch(setCurrentAccount(res.data))
            toast.success('Successfully changed username!', TOAST_OPTIONS)
            setUsernameError('')
            return true
        }
        toast.error(res.errorMessage ?? 'Error!', TOAST_OPTIONS)
        setUsernameError(res.errorMessage ?? 'Error!')
        return false
    }

    const handleSaveEmail = async (val: string): Promise<boolean> => {
        setAccountLoading(true)
        const res = await updateEmail(val)
        setAccountLoading(false)
        if (res.success && res.data) {
            dispatch(setCurrentAccount(res.data))
            toast.success('Successfully changed email!', TOAST_OPTIONS)
            setEmailError('')
            return true
        }
        toast.error(res.errorMessage ?? 'Error!', TOAST_OPTIONS)
        setEmailError(res.errorMessage ?? 'Error!')
        return false
    }

    const handleOldPassword: ChangeEventHandler<HTMLInputElement> = (e) => {
        setOldPassword(e.target.value)
    }
    const handleNewPassword: ChangeEventHandler<HTMLInputElement> = (e) => {
        setNewPassword(e.target.value)
    }
    const handleConfirm: ChangeEventHandler<HTMLInputElement> = (e) => {
        setConfirm(e.target.value)
    }

    const handleSavePassword = (): void => {
        setAccountLoading(true)
        setPasswordLoading(true)
        updatePassword(oldPassword, newPassword).then((res) => {
            if (res.success && res.data) {
                dispatch(setCurrentAccount(res.data))
                toast.success('Successfully changed password!', TOAST_OPTIONS)
                setPasswordError('')
                setChangingPassword(false)
            } else {
                toast.error(res.errorMessage ?? 'Error!', TOAST_OPTIONS)
                setPasswordError(res.errorMessage ?? 'Error!')
            }
            setAccountLoading(false)
            setPasswordLoading(false)
        })
    }

    const handleCancelSavePassword = (): void => {
        setChangingPassword(false)
        setPasswordError('')
        setOldPassword('')
        setNewPassword('')
        setConfirm('')
    }

    const handleConfirmDelete: ChangeEventHandler<HTMLInputElement> = (e) => {
        setConfirmDeleting(e.target.value)
    }

    const handleDelete = (): void => {
        setAccountLoading(true)
        setLoadingDelete(true)
        deleteUser(confirmDeleting).then((res) => {
            if (res.success) {
                router.push('/')
                toast.success('Successfully deleted account!', TOAST_OPTIONS)
            } else {
                toast.error(res.errorMessage, TOAST_OPTIONS)
                setErrorDeleting(res.errorMessage ?? 'Error!')
            }
            setAccountLoading(false)
            setLoadingDelete(false)
        })
    }

    const cancelDelete = (): void => {
        setConfirmDeleting('')
        setDeleting(false)
        setErrorDeleting('')
    }

    if (loading) {
        return (
            <Box>
                <Helmet title="Settings" />
                <UserNavbar />
                <Box sx={{
                    display: 'flex', height: '90vh', alignItems: 'center', justifyContent: 'center',
                }}
                >
                    <CircularProgress />
                </Box>
            </Box>
        )
    }

    return (
        <Box>
            <Helmet title="Settings" />
            <UserNavbar />
            <Container maxWidth="md" sx={{ mt: 6, mb: 20 }}>
                <BackButton />
                <Typography variant="h3" fontWeight="300" sx={{ mr: 1, textAlign: 'center', width: '100%' }}>
                    Settings
                </Typography>
                <Container maxWidth="md" sx={{ mt: 6 }}>
                    <Typography
                        variant="h4"
                        sx={{ mt: 5, mb: 3 }}
                        fontWeight="light"
                    >
                        Profile
                    </Typography>
                    <Paper variant="outlined">
                        {profileLoading && <LinearProgress />}
                        <Grid container alignItems="center" justifyContent="center" spacing={3} sx={{ p: 4 }}>
                            <Grid item xs={5}>
                                <Typography variant="h6">Profile Picture</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Stack>
                                    <Stack alignItems="center" direction="row">
                                        <ProfileAvatar size={75} sx={{ mr: 2 }} picture64={currentProfileImg} />
                                        <ImageUpload text="Change" onImageChange={handleImageChange} sizeLimit={PFP_LIMIT_MB} />
                                        <Button variant="outlined" sx={{ ml: 2 }} onClick={handleRemoveImage}>Remove</Button>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item xs={2}>
                                {changingProfileImg
                                && (
                                    <>
                                        <IconButton sx={{ ml: 1 }} title="Cancel Changes" onClick={handleCancelPfpChange}>
                                            <CancelIcon />
                                        </IconButton>
                                        <IconButton sx={{ ml: 1 }} title="Save Profile Picture" onClick={handleSaveProfileImg}>
                                            <SaveIcon />
                                        </IconButton>
                                    </>
                                )}
                            </Grid>
                            <Grid item xs={12}><Divider /></Grid>
                            <FormRow title="Display Name" value={name} disabled={profileLoading} onSave={handleSaveName} charLimit={LENGTH_LIMIT.USER.NAME} />
                            <Grid item xs={12}><Divider /></Grid>
                            <FormRow title="Biography" value={bio} multiline disabled={profileLoading} onSave={handleSaveBio} charLimit={LENGTH_LIMIT.USER.BIO} />
                        </Grid>
                    </Paper>
                    <Typography
                        variant="h4"
                        sx={{ mt: 10, mb: 3 }}
                        fontWeight="light"
                    >
                        Messaging
                    </Typography>
                    <Paper variant="outlined">
                        {messageLoading && <LinearProgress />}
                        <Grid container alignItems="center" justifyContent="center" spacing={3} sx={{ p: 4 }}>
                            <Grid item xs={7}>
                                <Typography variant="h6">Restrict incoming DMs to users you follow</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Switch checked={messageSetting} onChange={handleMessageSettingChange} />
                            </Grid>
                        </Grid>
                    </Paper>
                    <Typography
                        variant="h4"
                        sx={{ mt: 10, mb: 3 }}
                        fontWeight="light"
                    >
                        Account
                    </Typography>
                    <Paper variant="outlined">
                        {accountLoading && <LinearProgress />}
                        <Grid container alignItems="center" justifyContent="center" spacing={3} sx={{ p: 4 }}>
                            <FormRow
                                title="Username"
                                value={username}
                                disabled={accountLoading}
                                onSave={handleSaveUsername}
                                error={usernameError !== ''}
                                errorMessage={usernameError}
                            />
                            <Grid item xs={12}><Divider /></Grid>
                            <FormRow title="Email" value={email} disabled={accountLoading} onSave={handleSaveEmail} error={emailError !== ''} errorMessage={emailError} />
                            <Grid item xs={12}><Divider /></Grid>
                            <Grid item xs={5}>
                                <Typography variant="h6">Password</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                {changingPassword ? (
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 1 }}>Change Password</Typography>
                                        <PasswordField
                                            margin="dense"
                                            size="small"
                                            label="Old Password"
                                            helperText={passwordError === '' ? undefined : passwordError}
                                            onChange={handleOldPassword}
                                            error={passwordError !== ''}
                                        />
                                        <PasswordField
                                            margin="dense"
                                            size="small"
                                            label="New Password"
                                            helperText={passwordError === '' ? 'Use 8-25 characters with a mix of letters, numbers, and symbols' : passwordError}
                                            onChange={handleNewPassword}
                                            error={passwordError !== ''}
                                        />
                                        <PasswordField
                                            margin="dense"
                                            size="small"
                                            label="Confirm Password"
                                            onChange={handleConfirm}
                                            error={confirm !== '' && newPassword !== confirm}
                                        />
                                        <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
                                            <Button variant="outlined" onClick={handleCancelSavePassword}>Cancel</Button>
                                            <LoadingButton
                                                variant="contained"
                                                sx={{ ml: 2 }}
                                                loading={passwordLoading}
                                                onClick={handleSavePassword}
                                                disabled={oldPassword === '' || newPassword === '' || confirm === ''}
                                            >
                                                Save
                                            </LoadingButton>
                                        </Stack>
                                    </Box>
                                ) : <Button variant="outlined" onClick={() => setChangingPassword(true)}>Change Password</Button>}
                            </Grid>
                            <Grid item xs={12}><Divider /></Grid>
                            <Grid item xs={6}>
                                {deleting && (
                                    <PasswordField
                                        margin="dense"
                                        size="small"
                                        label="Enter Password"
                                        onChange={handleConfirmDelete}
                                        error={errorDeleting !== ''}
                                        helperText={errorDeleting === '' ? undefined : errorDeleting}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction="row" alignItems="center" justifyContent="end">
                                    {deleting && (
                                        <Button
                                            variant="outlined"
                                            sx={{ display: 'block', ml: 'auto' }}
                                            onClick={cancelDelete}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                    <LoadingButton
                                        variant="outlined"
                                        color="error"
                                        onClick={() => (deleting ? handleDelete() : setDeleting(true))}
                                        sx={{ ml: 2 }}
                                        loading={loadingDelete}
                                    >
                                        {deleting ? 'Confirm Delete' : 'Delete Account'}
                                    </LoadingButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Container>
        </Box>
    )
};

export default Settings;
