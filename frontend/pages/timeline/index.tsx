import SortIcon from '@mui/icons-material/Sort';
import {
    Box, CircularProgress, Container, Divider, IconButton, Stack, Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTimeline } from '../../src/api/timeline';
import { getUser } from '../../src/api/user';
import Helmet from '../../src/components/common/Helmet';
import LazyPost from '../../src/components/LazyPost';
import UserNavbar from '../../src/components/navbar/user';
import { setCurrentUser } from '../../src/store';
import { ID } from '../../src/types/misc';
import { ReduxStoreType } from '../../src/types/redux';

const TimelinePage: NextPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const { username } = useSelector((state: ReduxStoreType) => state.user)
    const [timeline, setTimeline] = useState([] as ID[])
    const [loading, setLoading] = useState(username === undefined)
    const [loadingTimeline, setLoadingTimeline] = useState(true)
    const [sortOldest, setSortOldest] = useState(false)

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
                    setTimeline(res.data.reverse())
                }
                setLoadingTimeline(false)
            })
        }
    }, [username, loading])

    const handleSortClick = (): void => {
        setSortOldest(!sortOldest)
    }

    if (loading) {
        return (
            <Box>
                <Helmet title="Timeline" />
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
            <Container maxWidth="md" sx={{ mt: 6, mb: 20, width: '90vw' }}>
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                    <Typography variant="h3" fontWeight="300" sx={{ mr: 'auto' }}>
                        Timeline
                    </Typography>
                    <Typography>{`${sortOldest ? 'Newest' : 'Oldest'} first`}</Typography>
                    <IconButton onClick={handleSortClick}>
                        <SortIcon />
                    </IconButton>
                </Stack>
                <Divider sx={{ my: 5 }} />
                {loadingTimeline
                    ? (
                        <Stack direction="row" justifyContent="center" sx={{ mt: 10 }}>
                            <CircularProgress />
                        </Stack>
                    )
                    : (
                        <Stack>
                            {timeline.length === 0
                                ? (
                                    <>
                                        <Typography variant="h6">Nothing to see here!</Typography>
                                        <Typography variant="h6">Follow users and topics to see posts here</Typography>
                                    </>
                                )
                                : (
                                    sortOldest
                                        ? timeline.map((postId) => (
                                            <Box key={postId} sx={{ my: 1 }}>
                                                <LazyPost key={postId} postId={postId} />
                                            </Box>
                                        )).reverse()
                                        : timeline.map((postId) => (
                                            <Box key={postId} sx={{ my: 1 }}>
                                                <LazyPost key={postId} postId={postId} />
                                            </Box>
                                        ))
                                )}
                        </Stack>
                    )}
            </Container>
        </Box>
    )
};

export default TimelinePage;
