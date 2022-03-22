import {
    Button, Stack, Box, Container, Grid, Typography, Skeleton, CircularProgress, Divider, Card,
} from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from '../../src/components/common/Link';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';
import { getProfile } from '../../src/api/user/profile';
import { ProfileType } from '../../src/types/user';
import UserNavbar from '../../src/components/navbar/user';
import Helmet from '../../src/components/common/Helmet';
import { ReduxStoreType } from '../../src/types/redux';
import { setCurrentUser } from '../../src/store';
import { getUser } from '../../src/api/user';

const UserProfilePage: NextPage = () => {
    const router = useRouter()
    const { query } = useRouter()
    const dispatch = useDispatch()
    const {
        userId, username, name, bio, profileImg, posts,
    } = useSelector((state: ReduxStoreType) => state.user)

    const [loadingUser, setLoadingUser] = useState(userId === undefined)
    const [profile, setProfile] = useState({} as ProfileType)
    const [loadingProfile, setLoadingProfile] = useState(true)

    const isSelf = useMemo(() => (
        userId && username && (query.usernameOrId === userId || query.usernameOrId === username)
    ), [query, userId, username])

    useEffect(() => {
        if (!userId) {
            getUser().then((res) => {
                if (res.success && res.data) {
                    dispatch(setCurrentUser(res.data))
                } else if (res.error === 401) {
                    router.push('/401')
                } else {
                    router.push('/404')
                }
                setLoadingUser(false)
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (query.usernameOrId) {
            if (isSelf && username && posts) {
                setProfile({
                    username, name, bio, profileImg, posts,
                })
                setLoadingProfile(false)
            } else {
                getProfile(query.usernameOrId as string)
                    .then((res) => {
                        if (res.success && res.data) {
                            setProfile(res.data)
                            window.history.replaceState(null, `${res.data.username}'s Profile`, `/profile/${res.data.username}`)
                        } else if (res.error === 401) {
                            router.push('/401')
                        } else {
                            router.push('/404')
                        }
                        setLoadingProfile(false)
                    })
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, query])

    if (loadingUser || !userId) {
        return (
            <Box>
                <Helmet title="Profile" />
                <UserNavbar />
                <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90vh',
                }}
                >
                    <CircularProgress />
                </Box>
            </Box>
        )
    }
    if (loadingProfile) {
        return (
            <Box>
                <Helmet title="Profile" />
                <UserNavbar />
                <Container sx={{ mt: 5 }}>
                    <Grid spacing={2} container>
                        <Grid item xs={3}>
                            <ProfileAvatar size={200} loading={loadingProfile} />
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
            <Helmet title={`${profile.username}'s Profile`} />
            <UserNavbar />
            <Container sx={{ mt: 5, width: '90vw' }}>
                <Stack direction="row" sx={{ mb: 5 }}>
                    <ProfileAvatar size={200} picture64={profile.profileImg} />
                    <Grid rowSpacing={2} container sx={{ ml: 5 }}>
                        <Grid item xs={12}>
                            <Typography variant="h4">{profile.name}</Typography>
                            <Typography variant="body1" fontWeight="light">
                                u/
                                {profile.username}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" fontWeight="normal">{profile.bio}</Typography>
                        </Grid>
                        {isSelf && (
                            <Grid item xs={12}>
                                <Button variant="contained" component={Link} href="/settings">Edit Profile</Button>
                            </Grid>
                        )}
                    </Grid>
                </Stack>
                <Divider />
                {/* TODO show user posts */}
                <Stack>
                    {profile.posts.length === 0
                        ? <Typography variant="h6">No posts made</Typography>
                        : (
                            profile.posts.map((post) => (
                                <Stack key={post} direction="row" alignItems="center">
                                    <Typography variant="body1">{post}</Typography>
                                    <Button onClick={() => router.push(`/post/${post}`)}>Go to post</Button>
                                </Stack>
                            ))
                        )}
                </Stack>
            </Container>
        </Box>

    )
};

export default UserProfilePage;
