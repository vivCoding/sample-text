import type { NextPage } from 'next';
import {
    Box, Button, Stack, Container, CircularProgress, Typography, Divider, Paper, Grid, InputAdornment, IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    ChangeEventHandler, useEffect, useLayoutEffect, useState,
} from 'react';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import { ReduxStoreType } from '../../src/types/redux';
import { getUser } from '../../src/api/user';
import { setCurrentUser } from '../../src/store';
import { ConversationType, MessageType } from '../../src/types/conversation';
import ConversationCard from '../../src/components/Conversation/ConversationCard';
import BackButton from '../../src/components/common/BackButton';
import MessageCard from '../../src/components/Conversation/Message';
import StyledTextField from '../../src/components/common/StyledTextField';
import { TOAST_OPTIONS } from '../../src/constants/toast';
import { getConversation, sendMessage } from '../../src/api/user/conversation';

const ConvosPage: NextPage = () => {
    const router = useRouter()
    const { query } = useRouter()
    const dispatch = useDispatch()

    const { username } = useSelector((state: ReduxStoreType) => state.user)
    const [loading, setLoading] = useState(username === undefined)
    const [conversationLoading, setConversationLoading] = useState(true)
    const [messages, setMessages] = useState([] as MessageType[])

    const [messageValue, setMessageValue] = useState('')
    const [sendLoading, setSendLoading] = useState(false)
    const [periodicRequest, setPeriodicRequest] = useState<NodeJS.Timer | undefined>(undefined)

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
                } else {
                    toast.error('Error! Could not get conversation')
                    if (periodicRequest) {
                        clearInterval(periodicRequest)
                    }
                }
            })
        }
    }

    useEffect(() => {
        if (username && !loading && query.conversationId && !periodicRequest) {
            getConversation(query.conversationId as string).then((res) => {
                if (res.success && res.data) {
                    setMessages(res.data.messages)
                    const timer = setInterval(getMessagesPeriodically, 1000)
                    setPeriodicRequest(timer)
                } else {
                    toast.error('Error! Could not get conversation')
                }
                setConversationLoading(false)
            })
        }
        return () => {
            if (periodicRequest) {
                clearInterval(periodicRequest)
            }
        }
    }, [username, loading, query, periodicRequest])

    // useLayoutEffect(() => {
    //     if (periodicRequest) {
    //         clearInterval(periodicRequest)
    //     }
    // }, [periodicRequest])

    const handleMessageChange : ChangeEventHandler<HTMLInputElement> = (e) => {
        setMessageValue(e.target.value)
    }

    const handleMessageSend = (): void => {
        setSendLoading(true)
        sendMessage(query.conversationId as string, messageValue).then((res) => {
            if (res.success) {
                setMessageValue('')
                setSendLoading(false)
            } else {
                toast.error('There was an error in sending message. Try again later!', TOAST_OPTIONS)
            }
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
            <Helmet title="Messaging" />
            <UserNavbar />
            <Container maxWidth="md" sx={{ mt: 6, mb: 20, width: '90vw' }}>
                <BackButton />
                <Stack sx={{
                    mt: 5, height: '55vh', overflow: 'auto',
                }}
                >
                    {messages.map((message) => (
                        <MessageCard key={message.timestamp + message.authorId} message={message} />
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
