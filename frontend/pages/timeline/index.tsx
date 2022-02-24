import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Stack, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import { ReduxStoreType } from '../../src/types/redux';

const ProfilePage: NextPage = () => {
    const { username } = useSelector((state: ReduxStoreType) => state.user)

    return (
        <Box>
            <Helmet title="Sample Text" />
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
