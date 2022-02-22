import type { NextPage } from 'next';
import {
    Button, Stack, Box, Container, Grid, Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import { ReduxStoreType } from '../../src/types/redux';
import ProfileAvatar from '../../src/components/common/ProfileAvatar';
import Link from '../../src/components/common/Link';

const ProfilePage: NextPage = () => {
    const {
        username, name, bio, pfp,
    } = useSelector((state: ReduxStoreType) => state.user)

    return (
        <Box>
            <Helmet title="Sample Text" />
            <UserNavbar />
            <Container sx={{ mt: 5 }}>
                {/* <Typography variant="h4" fontWeight="light" sx={{ mb: 3 }}>{username}</Typography> */}
                <Grid spacing={2} container>
                    <Grid item xs={3}>
                        <ProfileAvatar size={200} picture64={pfp} />
                    </Grid>
                    <Grid item xs={7} container>
                        <Grid item xs={12}>
                            <Typography variant="h4">{name}</Typography>
                            <Typography variant="body1" fontWeight="light">
                                u/
                                {username}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" fontWeight="normal">{bio}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component={Link} href="/settings">Edit Profile</Button>
                        </Grid>
                    </Grid>
                    {/* <Grid item xs={2}>
                        <Stack>
                            <Typography variant="h6">12 Posts</Typography>
                            <Typography variant="h6">324 Followers</Typography>
                            <Typography variant="h6">324 Following</Typography>
                        </Stack>
                    </Grid> */}
                </Grid>
            </Container>
        </Box>
    )
};

export default ProfilePage;
