import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, IconButton, Skeleton, Stack, styled, Tooltip, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person'
import { getPost } from '../../api/post';
import { getProfile } from '../../api/user/profile';
import { ID } from '../../types/misc';
import { PostType } from '../../types/post';
import { ReduxStoreType } from '../../types/redux';
import ProfileAvatar from '../common/ProfileAvatar';
import { Message } from '../../types/conversation';

interface MessageCardProps {
    message: Message,
}

const MessageCard = ({ message }: MessageCardProps): JSX.Element => {
    const router = useRouter()
    const { userId, username, profileImg } = useSelector((state: ReduxStoreType) => state.user)

    const [loading, setLoading] = useState(true)
    const [author, setAuthor] = useState('')
    const [authorPfp, setAuthorPfp] = useState('')

    const isSelf = useMemo(() => message.userId === userId, [message, userId])

    useEffect(() => {
        if (userId) {
            // if (message.userId === userId && username) {
            setAuthor(username ?? '')
            setAuthorPfp(profileImg ?? '')
            setLoading(false)
            // } else {
            // getProfile(message.userId).then((res) => {
            //     if (res.success && res.data) {
            //         setAuthor(res.data.username)
            //         setAuthorPfp(res.data.profileImg ?? '')
            //     }
            //     setLoading(false)
            // })
            // setLoading(false)
            // }
        }
    }, [message, userId, username, profileImg])

    const handleHeaderClick = (): void => {
        router.push(`/profile/${message.userId}`)
    }

    if (loading) {
        return (
            <Box sx={{ width: '100%', my: 1 }}>
                <Card sx={{ width: '60%', float: Math.random() > 0.5 ? 'right' : 'left' }}>
                    <CardContent>
                        <Skeleton variant="text" height={70} width="50%" />
                        <Stack direction="row" spacing={2}>
                            <Skeleton variant="text" height={30} width="40%" />
                            <Skeleton variant="text" height={30} width="60%" />
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%', my: 1 }}>
            <Card sx={{
                float: isSelf ? 'right' : 'left', maxWidth: '60%',
            }}
            >
                <CardActionArea onClick={handleHeaderClick}>
                    <CardHeader
                        avatar={<ProfileAvatar size={25} picture64={authorPfp} />}
                        title={`u/${author}`}
                    />
                </CardActionArea>
                <CardContent>
                    {message.message}
                </CardContent>
            </Card>
        </Box>
    )
}

export default MessageCard
