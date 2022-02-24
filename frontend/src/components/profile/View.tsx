import {
    Button, Stack, Box, Container, Grid, Typography, Skeleton, CircularProgress,
} from '@mui/material';
import Helmet from '../common/Helmet';
import UserNavbar from '../navbar/user';
import ProfileAvatar from '../common/ProfileAvatar';
import Link from '../common/Link';
import { ProfileType } from '../../types/user';

interface ProfileViewProps {
    username?: string,
    profile: ProfileType,
    loading: boolean,
    allowEdit?: boolean,
}

const ProfileView = ({
    username, profile, loading, allowEdit,
}: ProfileViewProps): JSX.Element => {
    if (loading || !username) {
        return (
            <Box>
                <Helmet title="Profile" />
                <UserNavbar />
                <Container sx={{ mt: 5 }}>
                    <Grid spacing={2} container>
                        <Grid item xs={3}>
                            <ProfileAvatar size={200} loading={loading} />
                        </Grid>
                        <Grid item xs={7} container>
                            <Grid item xs={12}>
                                <Skeleton width="40vw" height={80} />
                                <Skeleton width="20vw" height={40} />
                            </Grid>
                            <Grid item xs={12}>
                                <Skeleton width="50vw" height={200} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
                <Stack alignItems="center" sx={{ mt: 5 }}>
                    <CircularProgress />
                </Stack>
            </Box>
        )
    }

    return (
        <Box>
            <Helmet title={`${username}'s Profile`} />
            <UserNavbar />
            <Container sx={{ mt: 5 }}>
                {/* <Typography variant="h4" fontWeight="light" sx={{ mb: 3 }}>{username}</Typography> */}
                <Grid spacing={2} container>
                    <Grid item xs={3}>
                        <ProfileAvatar size={200} picture64={profile.profileImg} loading={loading} />
                    </Grid>
                    <Grid item xs={7} container>
                        <Grid item xs={12}>
                            <Typography variant="h4">{profile.name}</Typography>
                            <Typography variant="body1" fontWeight="light">
                                u/
                                {username}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" fontWeight="normal">{profile.bio}</Typography>
                        </Grid>
                        {allowEdit && (
                            <Grid item xs={12}>
                                <Button variant="contained" component={Link} href="/settings">Edit Profile</Button>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
};

export default ProfileView
