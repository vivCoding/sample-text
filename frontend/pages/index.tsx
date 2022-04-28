import LoginIcon from '@mui/icons-material/Login';
import {
    Button,
    Stack,
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Helmet from '../src/components/common/Helmet';
import Link from '../src/components/common/Link';
import Navbar from '../src/components/navbar';

const Home: NextPage = () => (
    <Box>
        <Helmet title="SAMPLE Text" />
        <Navbar />
        <Stack sx={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '90vh',
        }}
        >
            <Typography variant="h1">
                SAMPLE Text
            </Typography>
            <Typography variant="h6">
                Sample Social Platform for Everyone
            </Typography>
            <Stack direction="row" alignItems="center" sx={{ mt: 5 }}>
                <Button variant="outlined" component={Link} noLinkStyle href="/signup">Sign Up</Button>
                <Button variant="contained" component={Link} noLinkStyle href="/login" sx={{ ml: 3 }} endIcon={<LoginIcon />}>Login</Button>
            </Stack>
        </Stack>
    </Box>
);

export default Home;
