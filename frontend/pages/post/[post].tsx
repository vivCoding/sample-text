import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button, Stack, Container, IconButton, ButtonGroup, Divider, Skeleton, CircularProgress, Chip, styled, Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ShareIcon from '@mui/icons-material/Share';
import { toast, ToastContainer } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import { ReduxStoreType } from '../../src/types/redux';
import { setCurrentUser } from '../../src/store';
import { getUser } from '../../src/api/user';
import { PostType } from '../../src/types/post';
import { getPost } from '../../src/api/post';
import { TOAST_OPTIONS } from '../../src/constants/toast';
import BackButton from '../../src/components/common/BackButton';

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
    const { username } = useSelector((state: ReduxStoreType) => state.user)

    const [loading, setLoading] = useState(username === undefined)
    const [post, setPost]: [PostType | undefined, any] = useState({} as PostType)
    const [postLoading, setPostLoading] = useState(true)

    useEffect(() => {
        if (!username) {
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
    }, [router, dispatch, username])

    useEffect(() => {
        if (username) {
            const postId = router.query.post;
            setTimeout(() => setPostLoading(false), 2000)
            // getPost(postId).then((res) => {
            //     setPostLoading(false)
            // })
        }
    }, [username])

    const handleLike = (): void => {

    }

    const handleComment = (): void => {

    }

    const handleShare = (): void => {
        setPostLoading(true)
        navigator.clipboard.writeText(window.location.href)
        toast.success('Copied post URL to clipboard!', TOAST_OPTIONS)
    }

    const handleDelete = (): void => {

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
            <ToastContainer />
            <Helmet title="Sample Text" />
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
                        <Typography variant="h3" fontWeight="300" sx={{ mt: 1 }}>
                            Post Title
                        </Typography>
                        <Typography sx={{ my: 2 }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Typography>
                        <Box sx={{ textAlign: 'center' }}>
                            {post.img && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={post.img} style={{ maxWidth: '100%', maxHeight: '20em' }} alt="postImage" />
                            )}
                        </Box>
                        <Stack direction="row" justifyContent="end" alignItems="center">
                            <Stack direction="row" flexWrap="wrap" sx={{ mr: 'auto' }}>
                                {/* TODO: insert tagged topics here as chips */}
                                <StyledChip label="topic 1" />
                                <StyledChip label="topic 2" />
                                <StyledChip label="topic 3" />
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
                                <Tooltip title="Like Post">
                                    <IconButton onClick={handleLike}>
                                        {/* <ThumbUpOffAltIcon /> */}
                                        <ThumbUpIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Comment">
                                    <IconButton onClick={handleComment}>
                                        <AddCommentIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share Link">
                                    <IconButton onClick={handleShare}>
                                        <ShareIcon />
                                    </IconButton>
                                </Tooltip>
                                {/* TODO check if author matches */}
                                {/* {post.authorId ===} */}
                                <Tooltip title="Delete Post">
                                    <IconButton onClick={handleDelete} color="error">
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </Tooltip>
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
