import {
    Box, CircularProgress, Container, Divider, Stack, Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../src/api/user';
import Helmet from '../../src/components/common/Helmet';
import ConversationCard from '../../src/components/Conversation/ConversationCard';
import UserNavbar from '../../src/components/navbar/user';
import { setCurrentUser } from '../../src/store';
import { ReduxStoreType } from '../../src/types/redux';

const ConvosPage: NextPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const { username, conversations } = useSelector((state: ReduxStoreType) => state.user)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
    }, [router, dispatch, username])

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
                    {conversations?.length === 0 && <Typography variant="h6">No Conversations</Typography>}
                    {conversations?.map((conversation) => (
                        <Box key={conversation} sx={{ my: 1 }}>
                            <ConversationCard conversationId={conversation} />
                        </Box>
                    ))}
                </Stack>
            </Container>
        </Box>
    )
};

export default ConvosPage;
