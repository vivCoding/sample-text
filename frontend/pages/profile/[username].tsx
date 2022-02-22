import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button,
    Stack,
} from '@mui/material';
import Link from '../../src/components/common/Link';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';

const ProfilePage: NextPage = () => (
    <Box>
        <Helmet title="Sample Text" />
        <UserNavbar />
        <Stack sx={{
            alignItems: 'center', height: '90vh', justifyContent: 'center',
        }}
        >
            <Typography variant="h3">
                User profile viewing
                {/* TODO */}
            </Typography>
        </Stack>
    </Box>
);

export default ProfilePage;
