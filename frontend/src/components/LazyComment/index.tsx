import {
    Card, CardContent, CardHeader, Skeleton, Stack, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getProfile } from '../../api/user/profile';
import { Comment } from '../../types/post';
import { ReduxStoreType } from '../../types/redux';
import ProfileAvatar from '../common/ProfileAvatar';

interface LazyCommentProps {
    comment: Comment,
}

const LazyComment = ({ comment }: LazyCommentProps): JSX.Element => {
    const [commentLoading, setCommentLoading] = useState(true)
    const [authorName, setAuthorName] = useState('')
    const [authorPfp, setAuthorPfp] = useState('')

    useEffect(() => {
        const getAuthor = async (): Promise<void> => {
            const res = await getProfile(comment.userId)
            if (res.success && res.data) {
                setAuthorName(res.data.username)
                setAuthorPfp(res.data.profileImg ?? '')
            }
            setCommentLoading(false)
        }
        getAuthor()
    }, [comment])

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

    return (
        <Card>
            <CardHeader
                avatar={<ProfileAvatar size={25} picture64={authorPfp} />}
                title={`u/${authorName}`}
            />
            <CardContent sx={{ width: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                    {comment.comment}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default LazyComment
