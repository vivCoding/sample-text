import type { NextPage } from 'next';
import {
    Button, Stack, Box, Container, Grid, Typography, Skeleton, CircularProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import { ReduxStoreType } from '../../src/types/redux';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';
import Link from '../../src/components/common/Link';

const ProfilePage: NextPage = () => {
    const {
        username, name, bio, pfp,
    } = useSelector((state: ReduxStoreType) => state.user)

    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // TODO: use hook
    useEffect(() => {
        // TODO: get profile and auth, prob dont need if already in store
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

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
            <Helmet title="My Profile" />
            <UserNavbar />
            <Container sx={{ mt: 5 }}>
                {/* <Typography variant="h4" fontWeight="light" sx={{ mb: 3 }}>{username}</Typography> */}
                <Grid spacing={2} container>
                    <Grid item xs={3}>
                        <ProfileAvatar size={200} picture64={pfp} loading={loading} />
                    </Grid>
                    <Grid item xs={7} container>
                        <Grid item xs={12}>
                            <Typography variant="h4">{name}</Typography>
                            <Typography variant="body1" fontWeight="light">
                                u/
                                {username}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" fontWeight="normal">{bio}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component={Link} href="/settings">Edit Profile</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
};

export default ProfilePage;
