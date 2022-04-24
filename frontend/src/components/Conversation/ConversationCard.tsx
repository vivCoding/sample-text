import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    Card, CardActionArea, CardContent, CardHeader, CardMedia, IconButton, Skeleton, Stack, styled, Tooltip, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person'
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

interface ConversationCardProps {
    conversationId: ID,
}

const ConversationCard = ({ conversationId }: ConversationCardProps): JSX.Element => {
    const router = useRouter()
    const { userId, username, profileImg } = useSelector((state: ReduxStoreType) => state.user)

    const [conversation, setConversation] = useState({} as PostType)
    const [loading, setLoading] = useState(true)
    const [authorName, setAuthorName] = useState('')
    const [authorPfp, setAuthorPfp] = useState('')
    const [lastMessage, setLastMessage] = useState('')

    useEffect(() => {
        const getConversationAuthor = async (): Promise<void> => {
            // const res = await getPost(postId)
            // if (res.success && res.data) {
            //     setConversation(res.data)
            //     if (res.data.authorId && res.data.authorId === userId && username) {
            //         setAuthorName(username)
            //         setAuthorPfp(profileImg ?? '')
            //         setPostLoading(false)
            //     } else if (res.data.anonymous) {
            //         setIsAnonymous(true)
            //         setPostLoading(false)
            //     } else if (res.data.authorId) {
            //         const profileRes = await getProfile(res.data.authorId)
            //         if (profileRes.success && profileRes.data) {
            //             setAuthorName(profileRes.data.username)
            //             setAuthorPfp(profileRes.data.profileImg ?? '')
            //         } else if (profileRes.error === 401) {
            //             // show load post error instead
            //         } else {
            //             // show load post error instead
            //         }
            //         setPostLoading(false)
            //     }
            // } else if (res.error === 401) {
            //     // show load post error instead
            // } else {
            //     // show load post error instead
            // }
        }
        // getPostAndAuthor()
    }, [userId])

    const handleConversationClick = (): void => {
        router.push(`/conversations/${conversationId}`)
    }

    // if (loading) {
    //     return (
    //         <Card sx={{ width: '100%' }}>
    //             <CardContent>
    //                 <Skeleton variant="text" height={70} width="50%" />
    //                 <Stack direction="row" spacing={2}>
    //                     <Skeleton variant="text" height={30} width="40%" />
    //                     <Skeleton variant="text" height={30} width="60%" />
    //                 </Stack>
    //             </CardContent>
    //         </Card>
    //     )
    // }

    return (
        <Card sx={{ width: '100%' }}>
            <CardActionArea onClick={handleConversationClick}>
                <CardHeader
                    avatar={<ProfileAvatar size={25} picture64={profileImg} />}
                    title={`u/${username}`}
                    action={(
                        <Tooltip title="Go to Conversation">
                            <IconButton onClick={handleConversationClick}><ArrowForwardIcon /></IconButton>
                        </Tooltip>
                    )}
                    subheader="yo i thought that was a good idea"
                />
            </CardActionArea>
        </Card>
    )
}

export default ConversationCard
