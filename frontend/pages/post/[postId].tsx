import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button, Stack, Container, IconButton, ButtonGroup, Divider, Skeleton, CircularProgress, Chip, styled, Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
    useState, useEffect, useMemo,
} from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import { toast } from 'react-toastify';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import { ReduxStoreType } from '../../src/types/redux';
import { setCurrentUser } from '../../src/store';
import { getUser } from '../../src/api/user';
import { PostType } from '../../src/types/post';
import { deletePost, getPost } from '../../src/api/post';
import { TOAST_OPTIONS } from '../../src/constants/toast';
import BackButton from '../../src/components/common/BackButton';
import { getProfile } from '../../src/api/user/profile';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';

const StyledChip = styled(Chip)({
    margin: 5,
    cursor: 'pointer',
    '&:hover': {
        opacity: '70%',
        transition: '0.2s',
    },
})

const PostPage: NextPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const { userId, username, profileImg } = useSelector((state: ReduxStoreType) => state.user)

    const [loading, setLoading] = useState(userId === undefined)
    const [post, setPost]: [PostType | undefined, any] = useState({} as PostType)
    const [postLoading, setPostLoading] = useState(true)
    const [authorName, setAuthorName] = useState('')
    const [authorPfp, setAuthorPfp] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)

    const isSelfPost = useMemo(() => userId && post.authorId && post.authorId === userId, [userId, post])

    useEffect(() => {
        if (!userId) {
            getUser().then((res) => {
                if (res.success && res.data) {
                    dispatch(setCurrentUser(res.data))
                    setLoading(false)
                } else if (res.error === 401) {
                    router.push('/401')
                } else {
                    router.push('/404')
                }
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const getPostAndAuthor = async (): Promise<void> => {
            const postId = router.query.postId as string
            const res = await getPost(postId)
            if (res.success && res.data) {
                setPost(res.data)
                if (res.data.authorId && res.data.authorId === userId && username) {
                    setAuthorName(username)
                    setAuthorPfp(profileImg ?? '')
                    setPostLoading(false)
                } else if (res.data.anonymous) {
                    setIsAnonymous(true)
                    setPostLoading(false)
                } else if (res.data.authorId) {
                    const profileRes = await getProfile(res.data.authorId)
                    if (profileRes.success && profileRes.data) {
                        setAuthorName(profileRes.data.username)
                        setAuthorPfp(profileRes.data.profileImg ?? '')
                    } else if (profileRes.error === 401) {
                        router.push('/401')
                    } else {
                        router.push('/404')
                    }
                    setPostLoading(false)
                }
            } else if (res.error === 401) {
                router.push('/401')
            } else {
                router.push('/404')
            }
        }

        if (userId && !loading) {
            getPostAndAuthor()
        }
    }, [userId, loading, username])

    const handleLike = (): void => {
        // TODO implement
    }

    const handleComment = (): void => {
        // TODO implement
    }

    const handleShare = (): void => {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Copied post URL to clipboard!', TOAST_OPTIONS)
    }

    const handleDelete = (): void => {
        if (isSelfPost) {
            deletePost(post.postId).then((res) => {
                if (res.success) {
                    router.push(`/profile/${userId}`)
                    toast.success('Successfully deleted post!', TOAST_OPTIONS)
                } else {
                    toast.error('There was a problem deleting your post!', TOAST_OPTIONS)
                }
            })
        }
    }

    const handleAuthorClick = (): void => {
        if (!isAnonymous) {
            router.push(`/profile/${authorName}`)
        }
    }

    if (loading) {
        return (
            <Box>
                <Helmet title="Post" />
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
            <Helmet title={`${post.title === '' ? 'Post' : post.title} | Sample Text`} />
            <UserNavbar />
            <Container maxWidth="md" sx={{ mt: 6, mb: 20 }}>
                <BackButton />
                {postLoading ? (
                    <>
                        <Skeleton variant="text" height={100} />
                        <Stack direction="row" spacing={1}>
                            <Skeleton variant="text" width="55%" />
                            <Skeleton variant="text" width="45%" />
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Skeleton variant="text" width="45%" />
                            <Skeleton variant="text" width="55%" />
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="40%" />
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Skeleton variant="text" width="25%" />
                            <Skeleton variant="text" width="55%" />
                            <Skeleton variant="text" width="20%" />
                        </Stack>
                        <Stack direction="row" justifyContent="end" alignItems="center">
                            <Skeleton variant="rectangular" width="50%" sx={{ mr: 'auto' }} />
                            <Stack direction="row" justifyContent="end" spacing={1} sx={{ my: 1 }}>
                                <IconButton>
                                    <ThumbUpOffAltIcon />
                                </IconButton>
                                <IconButton>
                                    <AddCommentIcon />
                                </IconButton>
                                <IconButton>
                                    <ShareIcon />
                                </IconButton>
                            </Stack>
                        </Stack>
                        <Divider sx={{ mb: 4 }} />
                    </>
                ) : (
                    <>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ '&:hover': { cursor: 'pointer' }, mt: 3 }} onClick={handleAuthorClick}>
                            <ProfileAvatar size={25} picture64={authorPfp} />
                            <Typography variant="body1" fontWeight="light">
                                {isAnonymous ? 'Posted Anonymously' : `u/${authorName}`}
                            </Typography>
                        </Stack>
                        <Typography variant="h3" fontWeight="300">
                            {post.title}
                        </Typography>
                        <Typography sx={{ my: 2 }}>
                            {post.caption}
                        </Typography>
                        <Box sx={{ textAlign: 'center', my: 1 }}>
                            {post.img && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={post.img} style={{ maxWidth: '100%', maxHeight: '20em' }} alt="postImage" />
                            )}
                        </Box>
                        <Stack direction="row" justifyContent="end" alignItems="center">
                            <Stack direction="row" flexWrap="wrap" sx={{ mr: 'auto' }}>
                                {/* TODO: insert topic here */}
                                <StyledChip label="topic 1" />
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
                                <Tooltip title="Like Post">
                                    <Stack direction="row" alignItems="center">
                                        <IconButton onClick={handleLike}>
                                            <ThumbUpOffAltIcon />
                                            {/* <ThumbUpIcon /> */}
                                        </IconButton>
                                        <Typography variant="button">
                                            13
                                        </Typography>
                                    </Stack>
                                </Tooltip>
                                <Tooltip title="Comment">
                                    <Stack direction="row" alignItems="center">
                                        <IconButton onClick={handleComment}>
                                            <CommentIcon />
                                        </IconButton>
                                        <Typography variant="button">
                                            2
                                        </Typography>
                                    </Stack>
                                </Tooltip>
                                <Tooltip title="Share Link">
                                    <IconButton onClick={handleShare}>
                                        <ShareIcon />
                                    </IconButton>
                                </Tooltip>
                                {isSelfPost && (
                                    <Tooltip title="Delete Post">
                                        <IconButton onClick={handleDelete} color="error">
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Stack>
                        </Stack>
                        <Divider sx={{ mb: 4 }} />
                    </>
                )}
            </Container>
        </Box>
    )
};

export default PostPage;