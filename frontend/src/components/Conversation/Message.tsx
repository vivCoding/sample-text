import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, IconButton, Skeleton, Stack, styled, Tooltip, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person'
import { getProfile } from '../../api/user/profile';
import { ReduxStoreType } from '../../types/redux';
import ProfileAvatar from '../common/ProfileAvatar';
import { MessageType } from '../../types/conversation';

interface MessageCardProps {
    message: MessageType,
}

const MessageCard = ({ message }: MessageCardProps): JSX.Element => {
    const { userId, username, profileImg } = useSelector((state: ReduxStoreType) => state.user)

    const [loading, setLoading] = useState(true)
    const [author, setAuthor] = useState('')
    const [authorPfp, setAuthorPfp] = useState('')

    const isSelf = useMemo(() => message.authorId === userId, [message, userId])

    useEffect(() => {
        if (userId && author === '') {
            if (message.authorId === userId && username) {
                setAuthor(username ?? '')
                setAuthorPfp(profileImg ?? '')
                setLoading(false)
            } else {
                getProfile(message.authorId).then((res) => {
                    if (res.success && res.data) {
                        setAuthor(res.data.username)
                        setAuthorPfp(res.data.profileImg ?? '')
                    }
                    setLoading(false)
                })
            }
        }
    }, [message, userId, username, profileImg])

    if (loading) {
        return (
            <Box sx={{ width: '100%', my: 1 }}>
                <Card>
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
                <CardHeader
                    avatar={<ProfileAvatar size={25} picture64={authorPfp} />}
                    title={`u/${author}`}
                    subheader={message.timestamp}
                />
                <CardContent>
                    {message.message}
                </CardContent>
            </Card>
        </Box>
    )
}

export default MessageCard
