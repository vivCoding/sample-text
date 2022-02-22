import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button, Stack, Grid, Container, styled, Paper,
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Link from '../../src/components/common/Link';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';
import ImageUpload from '../../src/components/common/ImageUpload';

const Input = styled('input')({
    display: 'none',
});

const Settings: NextPage = () => (
    <Box>
        <Helmet title="Sample Text" />
        <UserNavbar />
        <Container maxWidth="md" sx={{ mt: 6, mb: 20 }}>
            <Stack direction="row" alignItems="center" justifyContent="center">
                <Typography variant="h3" fontWeight="300" sx={{ mr: 1 }}>
                    Settings
                </Typography>
                <SettingsOutlinedIcon sx={{ fontSize: 50 }} />
            </Stack>
            <Container maxWidth="md" sx={{ mt: 6 }}>
                <Typography
                    variant="h4"
                    sx={{ mt: 5, mb: 2, ml: 1 }}
                    fontWeight="light"
                >
                    Profile
                </Typography>
                <Paper variant="outlined" sx={{ py: 2, px: 4 }}>
                    <Grid container alignItems="center" justifyContent="center" spacing={3}>
                        {/* Profile section */}
                        <Grid item xs={6}>
                            <Typography variant="h6">Profile Picture</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack alignItems="center" direction="row">
                                <ProfileAvatar size={75} sx={{ mr: 2 }} />
                                <ImageUpload text="Change" />
                                <Button variant="outlined" sx={{ ml: 2 }}>Remove</Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6">Display Name</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Insert name</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6">Bio</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Insert bio hardy har har har har har</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <Typography
                    variant="h4"
                    sx={{ mt: 5, mb: 2, ml: 1 }}
                    fontWeight="light"
                >
                    Account
                </Typography>
                <Paper variant="outlined" sx={{ py: 2, px: 4 }}>
                    <Grid container alignItems="center" justifyContent="center" spacing={3}>
                        {/* Account section */}
                        <Grid item xs={6}>
                            <Typography variant="h6">Username</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Insert Username</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6">Email</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">something@gmail.com</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6">Password</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="outlined">Change Password</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Container>
    </Box>
);

export default Settings;
