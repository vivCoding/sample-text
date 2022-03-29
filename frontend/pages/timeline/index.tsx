import type { NextPage } from 'next';
import {
    Box, Button, Stack, Container, CircularProgress, Typography, Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import { ReduxStoreType } from '../../src/types/redux';
import { getUser } from '../../src/api/user';
import { getTimeline } from '../../src/api/timeline'
import { setCurrentUser } from '../../src/store';
import { ID } from '../../src/types/misc';
import LazyPost from '../../src/components/LazyPost';

const ProfilePage: NextPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const { username } = useSelector((state: ReduxStoreType) => state.user)
    const [timeline, setTimeline] = useState([] as ID[])
    const [loading, setLoading] = useState(username === undefined)
    const [loadingTimeline, setLoadingTimeline] = useState(true)

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

    useEffect(() => {
        if (username && !loading) {
            getTimeline().then((res) => {
                if (res.success && res.data) {
                    setTimeline(res.data)
                }
                setLoadingTimeline(false)
            })
        }
    }, [username, loading])

    if (loading) {
        return (
            <Box>
                <Helmet title="Create Post" />
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
            <Helmet title="Timeline" />
            <UserNavbar />
            <Container maxWidth="md" sx={{ mt: 6, mb: 20 }}>
                <Typography variant="h3" fontWeight="300">
                    Timeline
                </Typography>
                <Divider sx={{ my: 5 }} />
                <Box>
                    {loadingTimeline
                        ? <CircularProgress />
                        : (
                            <Stack alignItems="center">
                                {timeline.length === 0
                                    ? <Typography variant="h6">Nothing to see here!</Typography>
                                    : (
                                        timeline.map((postId) => (
                                            <Box key={postId} sx={{ my: 1 }}>
                                                <LazyPost key={postId} postId={postId} />
                                            </Box>
                                        ))
                                    )}
                            </Stack>
                        )}

                </Box>
            </Container>
        </Box>
    )
};

export default ProfilePage;
