import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button, Stack, Grid, Container, Paper, IconButton, InputAdornment, Divider, LinearProgress,
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { ChangeEventHandler, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { ToastContainer, toast } from 'react-toastify';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';
import ImageUpload from '../../src/components/common/ImageUpload';
import StyledTextField from '../../src/components/common/StyledTextField';
import { ReduxStoreType } from '../../src/types/redux';

import 'react-toastify/dist/ReactToastify.min.css'

const FormRow = ({
    title, value, onSave, multiline, disabled,
}: { title: string, value?: string, onSave?: any, multiline?: boolean, disabled?: boolean }): JSX.Element => {
    const [editing, setEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)

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
                        sx={{ pr: 0 }}
                    />
                ) : <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>{value ?? ''}</Typography>}
            </Grid>
            <Grid item xs={1}>
                {editing ? (
                    <IconButton sx={{ ml: 1 }} title={`Save ${title}`} disabled={disabled}>
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

    const [changingPassword, setChangingPassword] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const [profileLoading, setProfileLoading] = useState(false)
    const [accountLoading, setAccountLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    const handleOldPassword: ChangeEventHandler<HTMLInputElement> = (e) => {
        setOldPassword(e.target.value)
    }
    const handleNewPassword: ChangeEventHandler<HTMLInputElement> = (e) => {
        setNewPassword(e.target.value)
    }
    const handleConfirm: ChangeEventHandler<HTMLInputElement> = (e) => {
        setConfirm(e.target.value)
    }
    const handleSavePassword = () => {
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

    return (
        <Box>
            <ToastContainer />
            <Helmet title="Sample Text" />
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
                            <Grid item xs={7}>
                                <Stack alignItems="center" direction="row">
                                    <ProfileAvatar size={75} sx={{ mr: 2 }} />
                                    <ImageUpload text="Change" />
                                    <Button variant="outlined" sx={{ ml: 2 }}>Remove</Button>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}><Divider /></Grid>
                            <FormRow title="Display Name" value={name} disabled={profileLoading} />
                            <Grid item xs={12}><Divider /></Grid>
                            <FormRow title="Biography" value={bio} multiline disabled={profileLoading} />
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
                            <FormRow title="Username" value={username} disabled={accountLoading} />
                            <Grid item xs={12}><Divider /></Grid>
                            <FormRow title="Email" value={email} disabled={accountLoading} />
                            <Grid item xs={12}><Divider /></Grid>
                            <Grid item xs={5}>
                                <Typography variant="h6">Password</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                {changingPassword ? (
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 1 }}>Change Password</Typography>
                                        <StyledTextField margin="dense" size="small" label="Old Password" />
                                        <StyledTextField margin="dense" size="small" label="New Password" helperText="Use 8-25 characters with a mix of letters, numbers, and symbols" />
                                        <StyledTextField margin="dense" size="small" label="Confirm Password" />
                                        <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
                                            <Button variant="outlined" onClick={() => setChangingPassword(false)}>Cancel</Button>
                                            <LoadingButton variant="contained" sx={{ ml: 2 }} loading={passwordLoading} onClick={handleSavePassword}>Save</LoadingButton>
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
