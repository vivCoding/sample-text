import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    Card, CardActionArea, CardContent, CardHeader, CardMedia, IconButton, Skeleton, Stack, styled, Tooltip, Typography, Box,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person'
import { toast } from 'react-toastify';
import { getPost } from '../../api/post';
import { getProfile } from '../../api/user/profile';
import { ID } from '../../types/misc';
import { PostType } from '../../types/post';
import { ReduxStoreType } from '../../types/redux';
import ProfileAvatar from '../common/ProfileAvatar';
import { getConversation } from '../../api/user/conversation';

const OneLineTypography = styled(Typography)({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
})

interface ConversationCardProps {
    conversationId: ID,
}

const ConversationCard = ({ conversationId }: ConversationCardProps): JSX.Element | null => {
    const router = useRouter()
    const { userId } = useSelector((state: ReduxStoreType) => state.user)

    const [loading, setLoading] = useState(true)
    const [authorName, setAuthorName] = useState('')
    const [authorPfp, setAuthorPfp] = useState('')
    const [shouldShow, setShouldShow] = useState(false)
    const [lastMessageDate, setLastMessageDate] = useState('')
    const [lastMessage, setLastMessage] = useState('')

    useEffect(() => {
        const getConversationAuthor = async (): Promise<void> => {
            const res = await getConversation(conversationId)
            if (res.success && res.data) {
                const idToGet = userId === res.data.user1 ? res.data.user2 : res.data.user1
                const profileRes = await getProfile(idToGet)
                if (profileRes.success && profileRes.data) {
                    // TODO check blocking
                    if (!profileRes.data.messageSetting || (profileRes.data.messageSetting && profileRes.data.following?.find((followingId) => userId === followingId) !== undefined)) {
                        setAuthorName(profileRes.data.username)
                        setAuthorPfp(profileRes.data.profileImg ?? '')
                        const lm = res.data.messages.length === 0 ? undefined : res.data.messages[res.data.messages.length - 1]
                        setLastMessage(lm ? `${lm.authorId === userId ? 'You' : profileRes.data.username}: ${lm.message}` : 'No messages sent yet')
                        setLastMessageDate(lm ? lm.timestamp : '')
                        setShouldShow(true)
                    } else {
                        setShouldShow(false)
                    }
                    setLoading(false)
                }
            }
        }
        if (userId) {
            getConversationAuthor()
        }
    }, [userId, conversationId])

    const handleConversationClick = (): void => {
        router.push(`/conversations/${conversationId}`)
    }

    if (loading) {
        return (
            <Card sx={{ width: '100%' }}>
                <CardContent>
                    <Skeleton variant="text" height={70} width="50%" />
                    <Stack direction="row" spacing={2}>
                        <Skeleton variant="text" height={30} width="40%" />
                        <Skeleton variant="text" height={30} width="60%" />
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    if (!shouldShow) {
        return null
    }

    return (
        <Card sx={{ width: '100%' }}>
            <CardActionArea onClick={handleConversationClick}>
                <CardHeader
                    avatar={<ProfileAvatar size={25} picture64={authorPfp} />}
                    title={`u/${authorName}`}
                    action={(
                        <Tooltip title="Go to Conversation">
                            <IconButton onClick={handleConversationClick}><ArrowForwardIcon /></IconButton>
                        </Tooltip>
                    )}
                    subheader={lastMessageDate}
                />
            </CardActionArea>
            <CardContent>
                <OneLineTypography variant="body2">
                    {lastMessage}
                </OneLineTypography>
            </CardContent>
        </Card>
    )
}

export default ConversationCard
