import { LoadingButton } from '@mui/lab';
import {
    Box, CircularProgress, Container, Divider, Stack, Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { followTopic, getTopic, unfollowTopic } from '../../src/api/topic';
import { getUser } from '../../src/api/user';
import Helmet from '../../src/components/common/Helmet';
import LazyPost from '../../src/components/LazyPost';
import UserNavbar from '../../src/components/navbar/user';
import { TOAST_OPTIONS } from '../../src/constants/toast';
import { addFollowTopic, removeFollowTopic, setCurrentUser } from '../../src/store';
import { ReduxStoreType } from '../../src/types/redux';
import { TopicType } from '../../src/types/topic';

const ProfilePage: NextPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const { username, followedTopics } = useSelector((state: ReduxStoreType) => state.user)
    const [topic, setTopic] = useState({} as TopicType)
    const [loading, setLoading] = useState(username === undefined)
    const [loadingTopic, setLoadingTopic] = useState(true)
    const [followLoading, setFollowLoading] = useState(false)

    const isFollowing = useMemo(() => username && followedTopics && topic.topic && followedTopics.find((ft) => ft === topic.topic), [username, followedTopics, topic])

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
            const topicName = router.query.topicName as string
            getTopic(topicName).then((res) => {
                if (res.success && res.data) {
                    setTopic(res.data)
                } else {
                    router.push('/404')
                }
            })
            setLoadingTopic(false)
        }
    }, [router, username, loading])

    const handleFollow = (): void => {
        setFollowLoading(true)
        followTopic(topic.topic).then((res) => {
            if (res.success) {
                dispatch(addFollowTopic(topic.topic))
                toast.success('Successfully followed topic!', TOAST_OPTIONS)
            } else {
                toast.error('Error in following topic. Try again later!', TOAST_OPTIONS)
            }
            setFollowLoading(false)
        })
    }

    const handleUnfollow = (): void => {
        setFollowLoading(true)
        unfollowTopic(topic.topic).then((res) => {
            if (res.success) {
                dispatch(removeFollowTopic(topic.topic))
                toast.success('Successfully unfollowed topic!', TOAST_OPTIONS)
            } else {
                toast.error('Error in unfollowing topic. Try again later!', TOAST_OPTIONS)
            }
            setFollowLoading(false)
        })
    }

    if (loading || !topic) {
        return (
            <Box>
                <Helmet title="Topic" />
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
            <Helmet title={`${topic.topic ?? ''} Topic`} />
            <UserNavbar />
            <Container maxWidth="md" sx={{ mt: 6, mb: 20 }}>
                <Stack direction="row" sx={{ mt: 3 }} spacing={2} justifyContent="space-between" alignItems="center">
                    <Typography variant="h3" fontWeight="300" sx={{ maxWidth: '75%' }}>
                        {`# ${topic.topic ?? ''}`}
                    </Typography>
                    {isFollowing
                        ? (
                            <LoadingButton variant="contained" onClick={handleUnfollow} loading={followLoading}>Unfollow</LoadingButton>
                        ) : (
                            <LoadingButton variant="contained" onClick={handleFollow} loading={followLoading}>Follow</LoadingButton>
                        )}
                </Stack>
                <Divider sx={{ mt: 3, mb: 5 }} />
                <Stack>
                    {loadingTopic
                        ? <CircularProgress />
                        : (
                            topic.posts && topic.posts.map((postId) => (
                                <Box key={postId} sx={{ my: 1 }}>
                                    <LazyPost key={postId} postId={postId} />
                                </Box>
                            )).reverse()
                        )}
                </Stack>
            </Container>
        </Box>
    )
};

export default ProfilePage;
