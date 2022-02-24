import { Box, CircularProgress } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../src/api/user/profile';
import ProfileView from '../../src/components/profile/View';
import { ProfileType } from '../../src/types/user';
import UserNavbar from '../../src/components/navbar/user';
import Helmet from '../../src/components/common/Helmet';
import { ReduxStoreType } from '../../src/types/redux';
import { setCurrentUser } from '../../src/store';
import { getUser } from '../../src/api/user';

const UserProfilePage: NextPage = () => {
    const router = useRouter()
    const { query } = useRouter()
    const dispatch = useDispatch()
    const [profile, setProfile] = useState({} as ProfileType)
    const [loadingProfile, setLoadingProfile] = useState(true)

    const {
        username, name, bio, profileImg,
    } = useSelector((state: ReduxStoreType) => state.user)
    const [loadingUser, setLoadingUser] = useState(username === undefined)

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
                setLoadingUser(false)
            })
        }
    }, [])

    useEffect(() => {
        if (query.username) {
            if (username !== undefined && query.username === username) {
                setProfile({ name, bio, profileImg })
                setLoadingProfile(false)
            } else {
                getProfile(query.username as string).then((res) => {
                    if (res.success && res.data) {
                        setProfile(res.data)
                    } else if (res.error === 401) {
                        router.push('/401')
                    } else {
                        router.push('/404')
                    }
                    setLoadingProfile(false)
                })
            }
        }
    }, [router, query])

    if (loadingUser || !username) {
        return (
            <Box>
                <Helmet title="Profile" />
                <UserNavbar />
                <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90vh',
                }}
                >
                    <CircularProgress />
                </Box>
            </Box>
        )
    }

    return (
        <ProfileView username={query.username as string} profile={profile} loading={loadingProfile} allowEdit={username === query.username} />
    )
};

export default UserProfilePage;
