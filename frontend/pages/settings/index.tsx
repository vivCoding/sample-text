import type { GetServerSideProps, NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button, Stack, Grid, Container, Paper, IconButton, InputAdornment, Divider, LinearProgress, Skeleton, CircularProgress,
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { ChangeEventHandler, useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';
import ImageUpload from '../../src/components/common/ImageUpload';
import StyledTextField from '../../src/components/common/StyledTextField';
import { ReduxStoreType } from '../../src/types/redux';
import { setCurrentAccount, setCurrentProfile } from '../../src/store';
import { LENGTH_LIMIT } from '../../src/constants/formLimit';
import { badDummyRequest, randomDummyRequest } from '../../src/api/dummy';
import 'react-toastify/dist/ReactToastify.min.css'

const FormRow = ({
    title, value, onSave, multiline, disabled, charLimit,
}: { title: string, value?: string, onSave?: (val: string) => boolean, multiline?: boolean, disabled?: boolean, charLimit?: number }): JSX.Element => {
    const [editing, setEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)

    const handleValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setEditValue(e.target.value)
    }

    return (
        <>
            <Grid item xs={5}>
                <Typography variant="h6">{title}</Typography>
            </Grid>
            <Grid item xs={6}>
                {editing ? (
                    <StyledTextField
                        size="small"
                        defaultValue={value}
                        multiline={multiline}
                        minRows={(multiline ?? false) ? 3 : 1}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" sx={{ pr: 0 }}>
                                    <IconButton title="Cancel Changes" onClick={() => setEditing(false)}>
                                        <CancelIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={charLimit !== undefined && editValue !== undefined && editValue.length > charLimit}
                        helperText={charLimit ? `${(editValue && editValue.length) ?? 0} / ${charLimit}` : undefined}
                        sx={{ pr: 0 }}
                        onChange={handleValueChange}
                    />
                ) : <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>{value ?? ''}</Typography>}
            </Grid>
            <Grid item xs={1}>
                {editing ? (
                    <IconButton
                        sx={{ ml: 1 }}
                        title={`Save ${title}`}
                        disabled={disabled || (charLimit !== undefined && editValue !== undefined && editValue.length > charLimit)}
                        onClick={() => onSave && onSave(editValue ?? '') && setEditing(false)}
                    >
                        <SaveIcon />
                    </IconButton>
                ) : (
                    <IconButton sx={{ ml: 1 }} title="Change Username" onClick={() => setEditing(true)}>
                        <EditIcon />
                    </IconButton>
                )}
            </Grid>
        </>
    )
}

const Settings: NextPage = () => {
    const {
        username, email, name, bio, pfp,
    } = useSelector((state: ReduxStoreType) => state.user)
    const dispatch = useDispatch()

    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [changingPfp, setChangingPfp] = useState(false)
    const [currentPfp, setCurrentPfp] = useState(pfp)

    const [changingPassword, setChangingPassword] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const [profileLoading, setProfileLoading] = useState(false)
    const [accountLoading, setAccountLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    // TODO: implement swr hook instead
    useEffect(() => {
        setLoading(true)
        // TODO: auth, dont need if already in redux store
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    const handleImageChange = (image64: string): void => {
        setCurrentPfp(image64)
        setChangingPfp(true)
    }

    const handleRemoveImage = (): void => {
        setCurrentPfp('')
        setChangingPfp(true)
    }

    const handleSavePfp = (): void => {
        // TODO: api call
        setProfileLoading(true)
        if (username && email) {
            dispatch(setCurrentProfile({ name, bio, pfp: currentPfp }))
        }
        setChangingPfp(false)
        setProfileLoading(false)
    }

    const handleCancelPfpChange = (): void => {
        setCurrentPfp(pfp)
        setChangingPfp(false)
    }

    const handleSaveName = (val: string): boolean => {
        // TODO: api call
        if (username && email) {
            dispatch(setCurrentProfile({ name: val, bio, pfp }))
        }
        return true
    }

    const handleSaveBio = (val: string): boolean => {
        // TODO: api call
        if (username && email) {
            dispatch(setCurrentProfile({ name, bio: val, pfp }))
        }
        return true
    }

    const handleSaveUsername = (val: string): boolean => {
        // TODO: api call
        if (username && email) {
            dispatch(setCurrentAccount({ username: val, email }))
        }
        return true
    }

    const handleSaveEmail = (val: string): boolean => {
        // TODO: api call
        if (username && email) {
            dispatch(setCurrentAccount({ username, email: val }))
        }
        return true
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
        toast.success('Successfully changed password!', {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
            position: toast.POSITION.BOTTOM_RIGHT,
        })
        setPasswordLoading(false)
        setAccountLoading(false)
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
            <ToastContainer />
            <Helmet title="Settings" />
            <UserNavbar />
            <Container maxWidth="md" sx={{ mt: 6, mb: 20 }}>
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <Typography variant="h3" fontWeight="300" sx={{ mr: 1 }}>
                        Settings
                    </Typography>
                    {/* <SettingsOutlinedIcon sx={{ fontSize: 50 }} /> */}
                </Stack>
                <Container maxWidth="md" sx={{ mt: 6 }}>
                    <Typography
                        variant="h4"
                        sx={{ mt: 5, mb: 3, ml: 0.5 }}
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
                                        <ProfileAvatar size={75} sx={{ mr: 2 }} picture64={currentPfp} />
                                        <ImageUpload text="Change" onImageChange={handleImageChange} />
                                        <Button variant="outlined" sx={{ ml: 2 }} onClick={handleRemoveImage}>Remove</Button>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item xs={2}>
                                {changingPfp
                                && (
                                    <>
                                        <IconButton sx={{ ml: 1 }} title="Cancel Changes" onClick={handleCancelPfpChange}>
                                            <CancelIcon />
                                        </IconButton>
                                        <IconButton sx={{ ml: 1 }} title="Save Profile Picture" onClick={handleSavePfp}>
                                            <SaveIcon />
                                        </IconButton>
                                    </>
                                )}
                            </Grid>
                            <Grid item xs={12}><Divider /></Grid>
                            <FormRow title="Display Name" value={name} disabled={profileLoading} onSave={handleSaveName} charLimit={LENGTH_LIMIT.NAME} />
                            <Grid item xs={12}><Divider /></Grid>
                            <FormRow title="Biography" value={bio} multiline disabled={profileLoading} onSave={handleSaveBio} charLimit={LENGTH_LIMIT.BIO} />
                        </Grid>
                    </Paper>
                    <Typography
                        variant="h4"
                        sx={{ mt: 10, mb: 3, ml: 0.5 }}
                        fontWeight="light"
                    >
                        Account
                    </Typography>
                    <Paper variant="outlined">
                        {accountLoading && <LinearProgress />}
                        <Grid container alignItems="center" justifyContent="center" spacing={3} sx={{ p: 4 }}>
                            <FormRow title="Username" value={username} disabled={accountLoading} onSave={handleSaveUsername} />
                            <Grid item xs={12}><Divider /></Grid>
                            <FormRow title="Email" value={email} disabled={accountLoading} onSave={handleSaveEmail} />
                            <Grid item xs={12}><Divider /></Grid>
                            <Grid item xs={5}>
                                <Typography variant="h6">Password</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                {changingPassword ? (
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 1 }}>Change Password</Typography>
                                        <StyledTextField margin="dense" size="small" label="Old Password" onChange={handleOldPassword} />
                                        <StyledTextField
                                            margin="dense"
                                            size="small"
                                            label="New Password"
                                            helperText="Use 8-25 characters with a mix of letters, numbers, and symbols"
                                            onChange={handleNewPassword}
                                        />
                                        <StyledTextField
                                            margin="dense"
                                            size="small"
                                            label="Confirm Password"
                                            onChange={handleConfirm}
                                            error={confirm !== '' && newPassword !== confirm}
                                        />
                                        <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
                                            <Button variant="outlined" onClick={() => setChangingPassword(false)}>Cancel</Button>
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
                        </Grid>
                    </Paper>
                </Container>
            </Container>
        </Box>
    )
};

export default Settings;
