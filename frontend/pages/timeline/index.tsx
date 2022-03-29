import type { NextPage } from 'next';
import {
    Box, Button, Stack, Container, CircularProgress, Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import { ReduxStoreType } from '../../src/types/redux';
import { getUser } from '../../src/api/user';
import { setCurrentUser } from '../../src/store';

const ProfilePage: NextPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const { username } = useSelector((state: ReduxStoreType) => state.user)

    const [loading, setLoading] = useState(username === undefined)

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

    if (loading) {
        return (
            <Box>
                <Helmet title="Create Post" />
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
            <Helmet title="Timeline" />
            <UserNavbar />
            <Stack sx={{
                alignItems: 'center', height: '90vh', justifyContent: 'center',
            }}
            >
                <Typography variant="h3">
                    Timeline View
                    {/* TODO implement timeline */}
                </Typography>
            </Stack>
        </Box>
    )
};

export default ProfilePage;
