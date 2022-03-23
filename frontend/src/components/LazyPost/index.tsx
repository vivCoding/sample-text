import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    Card, CardActionArea, CardActions, CardContent, CardMedia, Skeleton, Stack, styled, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPost } from '../../api/post';
import { ID } from '../../types/misc';
import { PostType } from '../../types/post';

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

    const [post, setPost] = useState({} as PostType)
    const [postLoading, setPostLoading] = useState(true)

    useEffect(() => {
        getPost(postId).then((res) => {
            if (res.success && res.data) {
                setPost(res.data)
            }
            setPostLoading(false)
        })
    }, [postId])

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
                    <OneLineTypography>{post.title}</OneLineTypography>
                    <OneLineTypography variant="body2" color="text.secondary">
                        {post.caption}
                    </OneLineTypography>
                </CardContent>
            </Stack>
            <CardActionArea onClick={handlePostClick}>
                <CardActions sx={{ justifyContent: 'end' }}>
                    <Typography variant="button" color="primary">
                        View Post
                    </Typography>
                    <ArrowForwardIcon color="primary" />
                </CardActions>
            </CardActionArea>
        </Card>
    )
}

export default LazyPost
