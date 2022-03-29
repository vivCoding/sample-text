import { MotionPhotosAutoOutlined } from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    Button,
    Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, IconButton, Skeleton, Stack, styled, Tooltip, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getPost } from '../../api/post';
import { getProfile } from '../../api/user/profile';
import { ID } from '../../types/misc';
import { PostType } from '../../types/post';
import { ReduxStoreType } from '../../types/redux';
import ProfileAvatar from '../common/ProfileAvatar';

const OneLineTypography = styled(Typography)({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
})

interface LazyPostProps {
    postId: ID,
}

const LazyPost = ({ postId }: LazyPostProps): JSX.Element => {
    const router = useRouter()
    const { userId, username, profileImg } = useSelector((state: ReduxStoreType) => state.user)

    const [post, setPost] = useState({} as PostType)
    const [postLoading, setPostLoading] = useState(true)
    const [authorName, setAuthorName] = useState('')
    const [authorPfp, setAuthorPfp] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)

    useEffect(() => {
        const getPostAndAuthor = async (): Promise<void> => {
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
                        // show load post error instead
                    } else {
                        // show load post error instead
                    }
                    setPostLoading(false)
                }
            } else if (res.error === 401) {
                // show load post error instead
            } else {
                // show load post error instead
            }
        }
        getPostAndAuthor()
    }, [userId, username, profileImg, postId])

    const handlePostClick = (): void => {
        router.push(`/post/${postId}`)
    }

    if (postLoading) {
        return (
            <Card>
                <CardContent>
                    <Skeleton variant="text" height={70} width="50%" />
                    <Stack direction="row" spacing={2}>
                        <Skeleton variant="text" height={30} width="40%" />
                        <Skeleton variant="text" height={30} width="60%" />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Skeleton variant="text" height={30} width="10%" />
                        <Skeleton variant="text" height={30} width="70%" />
                        <Skeleton variant="text" height={30} width="20%" />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Skeleton variant="text" height={30} width="70%" />
                        <Skeleton variant="text" height={30} width="30%" />
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader
                avatar={<ProfileAvatar size={25} picture64={authorPfp} />}
                title={isAnonymous ? 'Anonymous' : `u/${authorName}`}
                subheader={post.date}
                action={(
                    <Tooltip title="Go to Post">
                        <IconButton onClick={handlePostClick}><ArrowForwardIcon /></IconButton>
                    </Tooltip>
                )}
            />
            <CardActionArea onClick={handlePostClick}>
                <Stack direction="row" sx={{ maxWidth: '100%' }}>
                    {post.img !== '' && (
                        <CardMedia
                            component="img"
                            image={post.img}
                            sx={{
                                maxWidth: '10%',
                            }}
                        />
                    )}
                    <CardContent sx={{ width: '100%' }}>
                        <OneLineTypography variant="h6">{post.title}</OneLineTypography>
                        <OneLineTypography variant="body2" color="text.secondary">
                            {post.caption}
                        </OneLineTypography>
                    </CardContent>
                </Stack>
            </CardActionArea>
        </Card>
    )
}

export default LazyPost
