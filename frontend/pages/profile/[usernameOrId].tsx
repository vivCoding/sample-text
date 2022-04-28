import BookmarkIcon from '@mui/icons-material/Bookmark';
import ChatIcon from '@mui/icons-material/Chat';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import LoveIcon from '@mui/icons-material/Favorite';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import ShieldIcon from '@mui/icons-material/Shield';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { LoadingButton } from '@mui/lab';
import {
    Box, Button, Chip, CircularProgress, Container, Divider, Grid, Skeleton, Stack, styled, Tab, Tabs, Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
    SyntheticEvent, useEffect, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { followUser, getUser, unfollowUser } from '../../src/api/user';
import { createConversation, getConversationByParticipants } from '../../src/api/user/conversation';
import {
    blockUser, getProfile, getUserline, unblockUser,
} from '../../src/api/user/profile';
import Helmet from '../../src/components/common/Helmet';
import Link from '../../src/components/common/Link';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';
import LazyPost from '../../src/components/LazyPost';
import LazyUserCard from '../../src/components/LazyUserCard';
import UserNavbar from '../../src/components/navbar/user';
import { TOAST_OPTIONS } from '../../src/constants/toast';
import {
    addBlocked, addConversation, removeBlocked, setCurrentUser,
} from '../../src/store';
import { ReduxStoreType } from '../../src/types/redux';
import { ProfileType } from '../../src/types/user';

const StyledChip = styled(Chip)({
    margin: 5,
    cursor: 'pointer',
    '&:hover': {
        opacity: '70%',
        transition: '0.2s',
    },
})

const UserProfilePage: NextPage = () => {
    const router = useRouter()
    const { query } = useRouter()
    const dispatch = useDispatch()
    const {
        userId, username, blocked,
    } = useSelector((state: ReduxStoreType) => state.user)

    const [loadingUser, setLoadingUser] = useState(userId === undefined)
    const [profile, setProfile] = useState({} as ProfileType)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [userline, setUserline] = useState([] as { postId: string, interactionType: string }[])
    const [tabValue, setTabValue] = useState(0)
    const [followLoading, setFollowLoading] = useState(false)
    const [blockLoading, setBlockLoading] = useState(false)
    const [messageLoading, setMessageLoading] = useState(false)
    const [canSendMessage, setCanSendMessage] = useState(false)

    const [isLoggedIn, setLoggedIn] = useState(userId !== undefined)
    const isSelf = useMemo(() => (
        userId && username && (query.usernameOrId === userId || query.usernameOrId === username)
    ), [query, userId, username])

    const isFollowing = useMemo(() => (
        userId && profile.followers && profile.followers.find((followerId) => userId === followerId)
    ), [userId, profile])

    // const [hasBlocked, setHasBlocked] = useState(false)
    const hasBlocked = useMemo(() => (
        userId && profile.userId && blocked && blocked.find((blockedId) => blockedId === profile.userId) !== undefined
    ), [userId, profile, blocked])

    useEffect(() => {
        if (!userId) {
            getUser().then((res) => {
                if (res.success && res.data) {
                    dispatch(setCurrentUser(res.data))
                    setLoggedIn(true)
                }
                setLoadingUser(false)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!loadingUser && query.usernameOrId) {
            getProfile(query.usernameOrId as string).then((res) => {
                if (res.success && res.data) {
                    setProfile(res.data)
                    // setHasBlocked(blocked?.find((blockedId) => blockedId === res.data?.userId) !== undefined)
                    if (!res.data.messageSetting) {
                        setCanSendMessage(true)
                    } else {
                        setCanSendMessage(res.data.following?.find((followingId) => userId === followingId) !== undefined)
                    }
                    window.history.replaceState(null, `${res.data.username}'s Profile`, `/profile/${res.data.username}`)
                } else {
                    router.push('/404')
                }
                setLoadingProfile(false)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, query, loadingUser, blocked])

    useEffect(() => {
        if (!loadingProfile && profile.userId) {
            getUserline(profile.userId).then((res) => {
                if (res.success && res.data) {
                    setUserline(res.data)
                }
            })
        }
    }, [router, query, loadingProfile, profile])

    const handleTabChange = (e: SyntheticEvent, newValue: number): void => {
        setTabValue(newValue)
    }

    const handleFollow = (): void => {
        setFollowLoading(true)
        followUser(profile.userId).then((res) => {
            if (res.success) {
                toast.success(`Successfully followed ${profile.username}!`, TOAST_OPTIONS)
                router.push(`/profile/${profile.userId}`)
            } else {
                toast.error(`Could not follow ${profile.username}. Try again later!`, TOAST_OPTIONS)
            }
            setFollowLoading(false)
        })
    }

    const handleUnfollow = (): void => {
        setFollowLoading(true)
        unfollowUser(profile.userId).then((res) => {
            if (res.success) {
                toast.success(`Successfully unfollowed ${profile.username}!`, TOAST_OPTIONS)
                router.push(`/profile/${profile.userId}`)
            } else {
                toast.error(`Could not unfollow ${profile.username}. Try again later!`, TOAST_OPTIONS)
            }
            setFollowLoading(false)
        })
    }

    const handleMessage = async (): Promise<void> => {
        setMessageLoading(true)
        if (canSendMessage && userId && profile.userId) {
            const res = await getConversationByParticipants(userId, profile.userId)
            if (res.success && res.data) {
                router.push(`/conversations/${res.data.convoId}`)
            } else if (res.error !== 401 && res.error !== 500) {
                const createRes = await createConversation(profile.userId)
                if (createRes.success && createRes.data) {
                    dispatch(addConversation(createRes.data.convoId))
                    router.push(`/conversations/${createRes.data.convoId}`)
                } else {
                    toast.error('Error! Could not create conversation', TOAST_OPTIONS)
                }
            } else {
                toast.error('Error! Could not access conversation!', TOAST_OPTIONS)
            }
        }
        setMessageLoading(false)
    }

    const handleBlockUser = (): void => {
        setBlockLoading(true)
        blockUser(profile.userId).then((res) => {
            if (res.success) {
                toast.success(`Successfully blocked ${profile.username}!`, TOAST_OPTIONS)
                dispatch(addBlocked(profile.userId))
            } else {
                toast.error(`Could not block ${profile.username}. Try again later!`, TOAST_OPTIONS)
            }
            setBlockLoading(false)
        })
    }

    const handleUnblockUser = (): void => {
        setBlockLoading(true)
        unblockUser(profile.userId).then((res) => {
            if (res.success) {
                toast.success(`Successfully unblocked ${profile.username}!`, TOAST_OPTIONS)
                dispatch(removeBlocked(profile.userId))
            } else {
                toast.error(`Could not unblock ${profile.username}. Try again later!`, TOAST_OPTIONS)
            }
            setBlockLoading(false)
        })
    }

    if (loadingUser) {
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
            <Container sx={{ mt: 5, width: '90vw', mb: 10 }}>
                <Stack direction="row">
                    <ProfileAvatar size={200} picture64={profile.profileImg} />
                    <Grid rowSpacing={2} container sx={{ ml: 5 }}>
                        <Grid item xs={12}>
                            <Typography variant="h4">{profile.name === '' ? `u/${profile.username}` : profile.name}</Typography>
                            <Typography variant="body1" fontWeight="light">
                                {`u/${profile.username}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" fontWeight="normal" sx={{ wordWrap: 'break-word' }}>{profile.bio}</Typography>
                        </Grid>
                        {isLoggedIn && (
                            <Grid item xs={12}>
                                {isSelf ? (
                                    <Button variant="contained" component={Link} href="/settings" startIcon={<EditIcon />}>Edit Profile</Button>
                                )
                                    : (
                                        <>
                                            {isFollowing
                                                ? (
                                                    <LoadingButton
                                                        variant="contained"
                                                        endIcon={<PersonRemoveIcon />}
                                                        onClick={handleUnfollow}
                                                        loading={followLoading}
                                                    >
                                                        Unfollow
                                                    </LoadingButton>
                                                ) : (
                                                    <LoadingButton
                                                        variant="contained"
                                                        endIcon={<PersonAddIcon />}
                                                        onClick={handleFollow}
                                                        loading={followLoading}
                                                    >
                                                        Follow
                                                    </LoadingButton>
                                                )}
                                            {canSendMessage && (
                                                <LoadingButton
                                                    variant="contained"
                                                    endIcon={<ChatIcon />}
                                                    onClick={handleMessage}
                                                    loading={messageLoading}
                                                    sx={{ ml: 2 }}
                                                >
                                                    Message
                                                </LoadingButton>
                                            )}
                                            {hasBlocked ? (
                                                <LoadingButton
                                                    variant="contained"
                                                    endIcon={<RemoveModeratorIcon />}
                                                    onClick={handleUnblockUser}
                                                    loading={blockLoading}
                                                    sx={{ ml: 2 }}
                                                >
                                                    Unblock
                                                </LoadingButton>
                                            ) : (
                                                <LoadingButton
                                                    variant="contained"
                                                    endIcon={<ShieldIcon />}
                                                    onClick={handleBlockUser}
                                                    loading={blockLoading}
                                                    sx={{ ml: 2 }}
                                                >
                                                    Block
                                                </LoadingButton>
                                            )}
                                        </>
                                    )}
                            </Grid>
                        )}
                    </Grid>
                    {isLoggedIn && (
                        <Stack spacing={2} sx={{ textAlign: 'right' }}>
                            <Box>
                                <Typography variant="h4">{profile.followers?.length}</Typography>
                                <Typography variant="body1">Followers</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h4">{profile.following?.length}</Typography>
                                <Typography variant="body1">Following</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h4">{profile.followedTopics?.length}</Typography>
                                <Typography variant="body1">
                                    Followed Topic
                                    {profile.followedTopics?.length !== 1 && 's'}
                                </Typography>
                            </Box>
                        </Stack>
                    )}
                </Stack>
                {isLoggedIn && (
                    <>
                        <Divider sx={{ mt: 5, mb: 1 }} />
                        <Tabs variant="scrollable" value={tabValue} onChange={handleTabChange}>
                            <Tab label="Posts" />
                            <Tab label="Interactions" />
                            <Tab label="Saved" />
                            <Tab label="Followers" />
                            <Tab label="Following" />
                            <Tab label="Followed Topics" />
                            {isSelf && <Tab label="Blocked Users" />}
                        </Tabs>
                        <Box sx={{ mt: 5 }}>
                            {tabValue === 0 && (
                                <>
                                    <Typography variant="h4" sx={{ mb: 3 }}>Posts Made</Typography>
                                    <Stack>
                                        {profile.posts?.length === 0
                                            ? <Typography variant="h6">No posts made</Typography>
                                            : (
                                                profile.posts?.map((postId) => (
                                                    <Box key={postId} sx={{ my: 1 }}>
                                                        <LazyPost key={postId} postId={postId} />
                                                    </Box>
                                                )).reverse()
                                            )}
                                    </Stack>
                                </>
                            )}
                            {tabValue === 1 && (
                                <>
                                    <Typography variant="h4" sx={{ mb: 3 }}>Post Interactions</Typography>
                                    <Stack>
                                        {userline.length === 0
                                            ? <Typography variant="h6">No Interactions made</Typography>
                                            : (
                                                userline.map((post) => (
                                                    <Stack direction="row" alignItems="center" key={post.postId} sx={{ my: 1 }}>
                                                        {post.interactionType === 'Liked'
                                                            ? <ThumbUpIcon fontSize="large" sx={{ mr: 5 }} />
                                                            : post.interactionType === 'Commented'
                                                                ? <CommentIcon fontSize="large" sx={{ mr: 5 }} />
                                                                : post.interactionType === 'Loved'
                                                                    ? <LoveIcon fontSize="large" sx={{ mr: 5 }} />
                                                                    : post.interactionType === 'Disliked'
                                                                        ? <ThumbDownIcon fontSize="large" sx={{ mr: 5 }} />
                                                                        : <BookmarkIcon fontSize="large" sx={{ mr: 5 }} />}
                                                        <LazyPost key={post.postId + post.interactionType} postId={post.postId} />
                                                    </Stack>
                                                ))
                                            )}
                                    </Stack>
                                </>
                            )}
                            {tabValue === 2 && (
                                <>
                                    <Typography variant="h4" sx={{ mb: 3 }}>Saved Posts</Typography>
                                    <Stack>
                                        {profile.savedPosts?.length === 0
                                            ? <Typography variant="h6">No saved posts</Typography>
                                            : (
                                                profile.savedPosts?.map((postId) => (
                                                    <Box key={postId} sx={{ my: 1 }}>
                                                        <LazyPost key={postId} postId={postId} />
                                                    </Box>
                                                ))
                                            )}
                                    </Stack>
                                </>
                            )}
                            {tabValue === 3 && (
                                <>
                                    <Typography variant="h4" sx={{ mb: 3 }}>Followers</Typography>
                                    <Stack>
                                        {profile.followers?.length === 0
                                            ? <Typography variant="h6">No followers</Typography>
                                            : (
                                                profile.followers?.map((followerId) => (
                                                    <Box key={followerId} sx={{ my: 1 }}>
                                                        <LazyUserCard userId={followerId} />
                                                    </Box>
                                                ))
                                            )}
                                    </Stack>
                                </>
                            )}
                            {tabValue === 4 && (
                                <>
                                    <Typography variant="h4" sx={{ mb: 3 }}>Following</Typography>
                                    <Stack>
                                        {profile.following?.length === 0
                                            ? <Typography variant="h6">Not following anybody</Typography>
                                            : (
                                                profile.following?.map((followerId) => (
                                                    <Box key={followerId} sx={{ my: 1 }}>
                                                        <LazyUserCard userId={followerId} />
                                                    </Box>
                                                ))
                                            )}
                                    </Stack>
                                </>
                            )}
                            {tabValue === 5 && (
                                <>
                                    <Typography variant="h4" sx={{ mb: 3 }}>Followed Topics</Typography>
                                    {profile.followedTopics?.length === 0
                                        ? <Typography variant="h6">Not following any topics</Typography>
                                        : (
                                            profile.followedTopics?.map((topicName) => (
                                                <StyledChip key={topicName} label={topicName} onClick={() => router.push(`/topic/${topicName}`)} />
                                            ))
                                        )}
                                </>
                            )}
                            {isSelf && tabValue === 6 && (
                                <>
                                    <Typography variant="h4" sx={{ mb: 3 }}>Blocked Users</Typography>
                                    <Stack>
                                        {blocked?.length === 0
                                            ? <Typography variant="h6">No blocked users</Typography>
                                            : (
                                                blocked?.map((blockedId) => (
                                                    <Box key={blockedId} sx={{ my: 1 }}>
                                                        <LazyUserCard userId={blockedId} />
                                                    </Box>
                                                ))
                                            )}
                                    </Stack>
                                </>
                            )}
                        </Box>
                    </>
                )}
            </Container>
        </Box>

    )
};

export default UserProfilePage;
