import {
    Button, Stack, Box, Container, Grid, Typography, Skeleton, CircularProgress, Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
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
    const router = useRouter()

    const handleCreatePost = (): void => {
        router.push('/post/create')
    }

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
            <Container sx={{ mt: 5, width: '90vw' }}>
                <Stack direction="row">
                    <ProfileAvatar size={200} picture64={profile.profileImg} loading={loading} />
                    <Grid rowSpacing={2} container sx={{ ml: 5 }}>
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
                </Stack>
                {allowEdit && (
                    <Fab color="primary" aria-label="add" sx={{ position: 'absolute', bottom: 50, right: 50 }} onClick={handleCreatePost}>
                        <AddIcon />
                    </Fab>
                )}
            </Container>
        </Box>
    )
};

export default ProfileView
