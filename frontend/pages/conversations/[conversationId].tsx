import type { NextPage } from 'next';
import {
    Box, Button, Stack, Container, CircularProgress, Typography, Divider, Paper, Grid, InputAdornment, IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import { ReduxStoreType } from '../../src/types/redux';
import { getUser } from '../../src/api/user';
import { setCurrentUser } from '../../src/store';
import { Conversation } from '../../src/types/conversation';
import ConversationCard from '../../src/components/Conversation/ConversationCard';
import BackButton from '../../src/components/common/BackButton';
import MessageCard from '../../src/components/Conversation/Message';
import StyledTextField from '../../src/components/common/StyledTextField';
import { TOAST_OPTIONS } from '../../src/constants/toast';

const ConvosPage: NextPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const { username } = useSelector((state: ReduxStoreType) => state.user)
    const [loading, setLoading] = useState(username === undefined)
    const [conversation, setConversation] = useState<Conversation | undefined>(undefined)
    const [conversationLoading, setConversationLoading] = useState(false)

    const [messageValue, setMessageValue] = useState('')
    const [sendLoading, setSendLoading] = useState(false)

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

    useEffect(() => {
        if (username && !loading) {
            // TODO get conversation
        }
    }, [username, loading])

    const handleMessageChange : ChangeEventHandler<HTMLInputElement> = (e) => {
        setMessageValue(e.target.value)
    }

    const handleMessageSend = (): void => {
        setSendLoading(true)
        // TODO send message
        toast.error('There was an error in sending message. Try again later!', TOAST_OPTIONS)
        setMessageValue('')
        setSendLoading(false)
    }

    if (loading) {
        return (
            <Box>
                <Helmet title="Conversations" />
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
                    <MessageCard message={{ userId: 'nice', message: 'wow thats kinda pog' }} />
                    <MessageCard message={{ userId: '62645ad594654c28ffbe0b33', message: 'hmmmmmmmmmmmmmmmmmm yes i do believe that we should do this and that and that and this' }} />
                    <MessageCard message={{ userId: 'nice', message: 'wow thats kinda pog' }} />
                </Stack>
                <Divider sx={{ mt: 1, mb: 3 }} />
                <StyledTextField
                    label="Send Message"
                    placeholder="Send Message"
                    onChange={handleMessageChange}
                    value={messageValue}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleMessageSend} disabled={sendLoading}>
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
