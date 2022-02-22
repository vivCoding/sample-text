import type { NextPage } from 'next';
import {
    Button, Stack, Box, Container, Grid, Typography,
} from '@mui/material';
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
            <Container sx={{ mt: 5 }}>
                <Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3">{username}</Typography>
                    </Grid>
                </Grid>

            </Container>
        </Box>
    )
};

export default ProfilePage;
