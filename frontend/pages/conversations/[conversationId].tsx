import SendIcon from '@mui/icons-material/Send';
import {
    Box, CircularProgress, Container, Divider, IconButton, InputAdornment, Stack, Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
    ChangeEventHandler, useEffect, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getUser } from '../../src/api/user';
import { getConversation, sendMessage } from '../../src/api/user/conversation';
import { getProfile } from '../../src/api/user/profile';
import BackButton from '../../src/components/common/BackButton';
import Helmet from '../../src/components/common/Helmet';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';
import StyledTextField from '../../src/components/common/StyledTextField';
import MessageCard from '../../src/components/Conversation/Message';
import UserNavbar from '../../src/components/navbar/user';
import { TOAST_OPTIONS } from '../../src/constants/toast';
import { setCurrentUser } from '../../src/store';
import { MessageType } from '../../src/types/conversation';
import { ReduxStoreType } from '../../src/types/redux';

const ConvosPage: NextPage = () => {
    const router = useRouter()
    const { query } = useRouter()
    const dispatch = useDispatch()

    const {
        userId, username, profileImg, blocked,
    } = useSelector((state: ReduxStoreType) => state.user)
    const [loading, setLoading] = useState(username === undefined)
    const [conversationLoading, setConversationLoading] = useState(true)
    const [messages, setMessages] = useState([] as MessageType[])

    const [messageValue, setMessageValue] = useState('')
    const [sendLoading, setSendLoading] = useState(false)
    const [periodicRequest, setPeriodicRequest] = useState<NodeJS.Timer | undefined>(undefined)

    const [otherUserId, setOtherUserId] = useState('')
    const [otherUsername, setOtherUsername] = useState('')
    const [otherPfp, setOtherPfp] = useState('')

    useEffect(() => {
        if (!username) {
            getUser().then((res) => {
                if (res.success && res.data) {
                    dispatch(setCurrentUser(res.data))
                } else if (res.error === 401) {
                    router.push('/401')
                } else {
                    router.push('/404')
                }
                setLoading(false)
            })
        }
    }, [router, dispatch, username])

    const getMessagesPeriodically = (): void => {
        if (username && !loading && query.conversationId) {
            getConversation(query.conversationId as string).then((res) => {
                if (res.success && res.data) {
                    setMessages(res.data.messages)
                } else if (periodicRequest) {
                    clearInterval(periodicRequest)
                }
            })
        }
    }

    useEffect(() => {
        const getConversationAndOther = async (): Promise<void> => {
            if (userId && !loading && query.conversationId && !periodicRequest) {
                const convoRes = await getConversation(query.conversationId as string)
                if (convoRes.success && convoRes.data) {
                    const userToGet = userId === convoRes.data.user1 ? convoRes.data.user2 : convoRes.data.user1
                    if (blocked?.find((blockedId) => blockedId === userToGet) !== undefined) {
                        router.push('/404')
                    } else {
                        const res = await getProfile(userToGet)
                        if (res.success && res.data) {
                            if (!res.data.messageSetting || (res.data.messageSetting && res.data.following?.find((followingId) => userId === followingId) !== undefined)) {
                                setOtherUserId(userToGet)
                                setOtherUsername(res.data.username)
                                setOtherPfp(res.data.profileImg ?? '')
                                setMessages(convoRes.data.messages)
                                const timer = setInterval(getMessagesPeriodically, 2000)
                                setPeriodicRequest(timer)
                                setConversationLoading(false)
                            } else {
                                router.push('/404')
                            }
                        } else {
                            router.push('/404')
                        }
                    }
                }
            }
        }
        getConversationAndOther()
        return () => {
            if (periodicRequest) {
                clearInterval(periodicRequest)
            }
        }
    }, [router, userId, username, loading, query, periodicRequest])

    const handleMessageChange : ChangeEventHandler<HTMLInputElement> = (e) => {
        setMessageValue(e.target.value)
    }

    const handleMessageSend = (): void => {
        setSendLoading(true)
        sendMessage(query.conversationId as string, messageValue).then((res) => {
            if (res.success) {
                setMessageValue('')
            } else {
                toast.error('Error! Could not send message.', TOAST_OPTIONS)
                if (periodicRequest) {
                    clearInterval(periodicRequest)
                }
            }
            setSendLoading(false)
        })
    }

    if (loading || conversationLoading) {
        return (
            <Box>
                <Helmet title="Messaging" />
                <UserNavbar />
                <Box sx={{
                    display: 'flex', height: '90vh', alignItems: 'center', justifyContent: 'center',
                }}
                >
                    <CircularProgress />
                </Box>
            </Box>
        )
    }

    return (
        <Box>
            <Helmet title={`${otherUsername} - Messaging`} />
            <UserNavbar />
            <Container maxWidth="md" sx={{ mt: 4, mb: 20, width: '90vw' }}>
                <BackButton />
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    onClick={() => router.push(`/profile/${otherUserId}`)}
                    sx={{
                        mt: 1,
                        '&:hover': {
                            cursor: 'pointer',
                            opacity: '75%',
                            transition: '0.2s',
                        },
                    }}
                >
                    <ProfileAvatar size={40} picture64={otherPfp} />
                    <Typography variant="h5">
                        {`u/${otherUsername}`}
                    </Typography>
                </Stack>
                <Stack sx={{
                    mt: 2, height: '50vh', overflow: 'auto',
                }}
                >
                    {messages.map((message) => (
                        <MessageCard
                            key={message.timestamp + message.authorId}
                            authorUsername={message.authorId === userId && username ? username : otherUsername}
                            authorPfp={message.authorId === userId ? (profileImg ?? '') : otherPfp}
                            message={message}
                        />
                    ))}
                </Stack>
                <Divider sx={{ mt: 1, mb: 3 }} />
                <StyledTextField
                    label="Send Message"
                    placeholder="Send Message"
                    onChange={handleMessageChange}
                    value={messageValue}
                    helperText={`${messageValue.length} / 200`}
                    error={messageValue.length > 200}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleMessageSend} disabled={sendLoading || messageValue.length > 200}>
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Container>
        </Box>
    )
};

export default ConvosPage;
