import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import {
    Chip, CircularProgress, Container, Divider, IconButton, Skeleton, Stack, styled, Tooltip,
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
    ChangeEventHandler, useEffect, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { LoadingButton } from '@mui/lab';
import {
    deletePost, getPost, likePost, unlikePost, unsavePost, savePost, commentOnPost,
} from '../../src/api/post';
import { getUser } from '../../src/api/user';
import { getProfile } from '../../src/api/user/profile';
import BackButton from '../../src/components/common/BackButton';
import Helmet from '../../src/components/common/Helmet';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';
import UserNavbar from '../../src/components/navbar/user';
import { TOAST_OPTIONS } from '../../src/constants/toast';
import {
    addSavedPost, removePostId, removeSavedPost, setCurrentUser,
} from '../../src/store';
import { PostType, Comment } from '../../src/types/post';
import { ReduxStoreType } from '../../src/types/redux';
import StyledTextField from '../../src/components/common/StyledTextField';
import LazyComment from '../../src/components/LazyComment';

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
    const {
        userId, username, profileImg, savedPosts,
    } = useSelector((state: ReduxStoreType) => state.user)

    const [loading, setLoading] = useState(userId === undefined)
    const [post, setPost]: [PostType | undefined, any] = useState({} as PostType)
    const [postLoading, setPostLoading] = useState(true)
    const [authorName, setAuthorName] = useState('')
    const [authorPfp, setAuthorPfp] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [hasLikedPost, setHasLikedPost] = useState(false)
    const [comments, setComments]: [Comment[], any] = useState([])
    const [likeCount, setLikeCount] = useState(0)
    const [hasSavedPost, setHasSavedPost] = useState(false)
    const [commentValue, setCommentValue] = useState('')
    const [isAdding, setIsAdding] = useState(false)

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
                setHasLikedPost(res.data.likes.find((userLike) => userLike === userId) !== undefined)
                setLikeCount(res.data.likes.length)
                setHasSavedPost(savedPosts !== undefined && savedPosts.find((savePostId) => savePostId === postId) !== undefined)
                setComments(res.data.comments)
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
    }, [userId, loading, username, savedPosts])

    const handleLike = (): void => {
        if (hasLikedPost) {
            unlikePost(post.postId).then((res) => {
                if (res.success && res.data) {
                    setLikeCount(res.data.likeCount)
                    setHasLikedPost(false)
                } else {
                    toast.error('There was an error in unliking the post', TOAST_OPTIONS)
                }
            })
        } else {
            likePost(post.postId).then((res) => {
                if (res.success && res.data) {
                    setLikeCount(res.data.likeCount)
                    setHasLikedPost(true)
                } else {
                    toast.error('There was an error in liking the post', TOAST_OPTIONS)
                }
            })
        }
    }

    const handleCommentOnChange : ChangeEventHandler<HTMLInputElement> = (e) => {
        setCommentValue(e.target.value)
    }

    const handleComment = (): void => {
        setIsAdding(true)
        commentOnPost(post.postId, commentValue).then((res) => {
            if (res.success && res.data) {
                setComments(res.data.comments)
                setCommentValue('')
                toast.success('Successfully commented on the post!', TOAST_OPTIONS)
            } else {
                toast.error('There was an error in commenting on the post', TOAST_OPTIONS)
            }
            setIsAdding(false)
        })
    }

    const handleShare = (): void => {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Copied post URL to clipboard!', TOAST_OPTIONS)
    }

    const handleSave = (): void => {
        if (hasSavedPost) {
            unsavePost(post.postId).then((res) => {
                if (res.success) {
                    setHasSavedPost(false)
                    dispatch(removeSavedPost(post.postId))
                    toast.success('Successfully unsaved the post!', TOAST_OPTIONS)
                } else {
                    toast.error('There was an error in unsaving the post', TOAST_OPTIONS)
                }
            })
        } else {
            savePost(post.postId).then((res) => {
                if (res.success) {
                    setHasSavedPost(true)
                    dispatch(addSavedPost(post.postId))
                    toast.success('Successfully saved the post!', TOAST_OPTIONS)
                } else {
                    toast.error('There was an error in saving the post', TOAST_OPTIONS)
                }
            })
        }
    }

    const handleDelete = (): void => {
        if (isSelfPost) {
            deletePost(post.postId).then((res) => {
                if (res.success) {
                    dispatch(removePostId(post.postId))
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
            <Helmet title={`${(post.title ?? '') === '' ? 'Post' : post.title} | Sample Text`} />
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
                    <Box sx={{ mt: 3 }}>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            onClick={handleAuthorClick}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Posted by
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{
                                    '&:hover': {
                                        cursor: isAnonymous ? 'auto' : 'pointer',
                                        opacity: isAnonymous ? '100%' : '75%',
                                        transition: isAnonymous ? '0.2s' : '0.2s',
                                    },
                                }}
                            >
                                <ProfileAvatar size={25} picture64={authorPfp} />
                                <Typography variant="body2">
                                    {isAnonymous ? 'Anonymous' : `u/${authorName}`}
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                {`at ${post.date}`}
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
                                <StyledChip label={post.topic} onClick={() => router.push(`/topic/${post.topic}`)} />
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
                                <Tooltip title="Like Post">
                                    <Stack direction="row" alignItems="center">
                                        <IconButton onClick={handleLike}>
                                            {hasLikedPost
                                                ? <ThumbUpIcon />
                                                : <ThumbUpOffAltIcon />}
                                        </IconButton>
                                        <Typography variant="button">
                                            {likeCount}
                                        </Typography>
                                    </Stack>
                                </Tooltip>
                                <Tooltip title="Comments">
                                    <Stack direction="row" alignItems="center">
                                        <IconButton>
                                            <CommentIcon />
                                        </IconButton>
                                        <Typography variant="button">
                                            {comments.length}
                                        </Typography>
                                    </Stack>
                                </Tooltip>
                                <Tooltip title="Save Post">
                                    {/* TODO: set icon and save tooltip title conditionally */}
                                    <IconButton onClick={handleSave}>
                                        {hasSavedPost
                                            ? <BookmarkIcon />
                                            : <BookmarkBorderIcon />}

                                    </IconButton>
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
                        <Box>
                            {/* <Typography variant="h5">Add Comment</Typography> */}
                            <StyledTextField
                                label="Add Comment"
                                multiline
                                minRows={3}
                                placeholder="Add comment"
                                onChange={handleCommentOnChange}
                                value={commentValue}
                                error={commentValue.length > 500}
                                helperText={`${commentValue.length} / 500`}
                                disabled={isAdding}
                            />
                            <Stack direction="row" justifyContent="flex-end">
                                <LoadingButton
                                    variant="contained"
                                    loading={isAdding}
                                    onClick={handleComment}
                                    disabled={commentValue.length === 0 || commentValue.length > 500}
                                >
                                    Add Comment

                                </LoadingButton>
                            </Stack>
                        </Box>
                        <Stack>
                            <Typography variant="h4" sx={{ mt: 3, mb: 4 }}>Comments</Typography>
                            {comments.length === 0
                                ? (
                                    <Typography variant="h6">No comments</Typography>
                                ) : (
                                    comments.map((comment) => (
                                        <Box key={comment.comment} sx={{ my: 1 }}>
                                            <LazyComment comment={comment} />
                                        </Box>
                                    ))
                                )}
                        </Stack>
                    </Box>
                )}
            </Container>
        </Box>
    )
};

export default PostPage;
