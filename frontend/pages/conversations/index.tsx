import type { NextPage } from 'next';
import {
    Box, Button, Stack, Container, CircularProgress, Typography, Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import { ReduxStoreType } from '../../src/types/redux';
import { getUser } from '../../src/api/user';
import { setCurrentUser } from '../../src/store';
import { Conversation } from '../../src/types/conversation';
import ConversationCard from '../../src/components/Conversation/ConversationCard';

const ConvosPage: NextPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const { username } = useSelector((state: ReduxStoreType) => state.user)
    const [loading, setLoading] = useState(username === undefined)
    const [convos, setConvos] = useState([] as Conversation[])

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
            // TODO get convos
        }
    }, [username, loading])

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
            <Helmet title="Conversations" />
            <UserNavbar />
            <Container maxWidth="md" sx={{ mt: 6, mb: 20, width: '90vw' }}>
                <Typography variant="h3" fontWeight="300">
                    Conversations
                </Typography>
                <Divider sx={{ my: 5 }} />
                <Stack>
                    <ConversationCard conversationId="nice" />
                </Stack>
            </Container>
        </Box>
    )
};

export default ConvosPage;
