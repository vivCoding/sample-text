import {
    Card, CardActionArea, CardContent, CardHeader, Skeleton, Stack, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getProfile } from '../../api/user/profile';
import { Comment } from '../../types/post';
import { ReduxStoreType } from '../../types/redux';
import ProfileAvatar from '../common/ProfileAvatar';

interface LazyCommentProps {
    comment: Comment,
}

const LazyComment = ({ comment }: LazyCommentProps): JSX.Element | null => {
    const router = useRouter()
    const { userId, username, profileImg } = useSelector((state: ReduxStoreType) => state.user)

    const [commentLoading, setCommentLoading] = useState(true)
    const [authorName, setAuthorName] = useState('')
    const [authorPfp, setAuthorPfp] = useState('')
    const [shouldShow, setShouldShow] = useState(false)

    const isSelf = useMemo(() => comment.userId && userId === comment.userId, [userId, comment])

    useEffect(() => {
        const getAuthor = async (): Promise<void> => {
            const res = await getProfile(comment.userId)
            if (res.success && res.data) {
                setAuthorName(res.data.username)
                setAuthorPfp(res.data.profileImg ?? '')
                setShouldShow(true)
            }
            setCommentLoading(false)
        }
        if (comment.userId !== userId) {
            getAuthor()
        }
    }, [userId, comment])

    if (commentLoading) {
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

    if (!shouldShow) return null

    return (
        <Card>
            <CardActionArea onClick={() => router.push(`/profile/${isSelf ? username : authorName}`)}>
                <CardHeader
                    avatar={<ProfileAvatar size={25} picture64={isSelf ? profileImg : authorPfp} />}
                    title={`u/${isSelf ? username : authorName}`}
                />
            </CardActionArea>
            <CardContent sx={{ width: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                    {comment.comment}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default LazyComment
