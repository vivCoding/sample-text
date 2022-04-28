import {
    Box, Card, CardActionArea, CardContent, CardHeader,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { MessageType } from '../../types/conversation';
import { ReduxStoreType } from '../../types/redux';
import ProfileAvatar from '../common/ProfileAvatar';

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
