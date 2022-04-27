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
    authorUsername: string,
    authorPfp: string,
    message: MessageType,
}

const MessageCard = ({ authorUsername, authorPfp, message }: MessageCardProps): JSX.Element => {
    const { userId } = useSelector((state: ReduxStoreType) => state.user)
    const router = useRouter()

    const isSelf = useMemo(() => message.authorId === userId, [message, userId])

    return (
        <Box sx={{ width: '100%', my: 1 }}>
            <Card sx={{
                float: isSelf ? 'right' : 'left', maxWidth: '60%',
            }}
            >
                <CardActionArea onClick={() => router.push(`/profile/${authorUsername}`)}>
                    <CardHeader
                        avatar={<ProfileAvatar size={25} picture64={authorPfp} />}
                        title={`u/${authorUsername}`}
                        subheader={message.timestamp}
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
