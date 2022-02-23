import {
    Button, Stack, Box, Container, Grid, Typography, Skeleton, CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/router';
import Helmet from '../common/Helmet';
import UserNavbar from '../navbar/user';
import ProfileAvatar from '../common/ProfileAvatar';
import Link from '../common/Link';
import { useUserProfile } from '../../api/user/hooks';

interface ProfileViewProps {
    username?: string,
    allowEdit?: false,
}

const ProfileView = ({ username, allowEdit }: ProfileViewProps): JSX.Element => {
    const { loading, auth, data } = useUserProfile(username)
    const router = useRouter()

    if (!auth) {
        router.push('/401')
    }

    if (loading) {
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
                                <Skeleton width={400} height={80} />
                                <Skeleton width={200} height={40} />
                            </Grid>
                            <Grid item xs={12}>
                                <Skeleton width={1000} height={200} />
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
                        <ProfileAvatar size={200} picture64={data?.pfp} loading={loading} />
                    </Grid>
                    <Grid item xs={7} container>
                        <Grid item xs={12}>
                            <Typography variant="h4">{data?.name}</Typography>
                            <Typography variant="body1" fontWeight="light">
                                u/
                                {username}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" fontWeight="normal">{data?.bio}</Typography>
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
