import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button,
    Stack,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Link from '../src/components/common/Link';
import Helmet from '../src/components/common/Helmet';
import Navbar from '../src/components/navbar';

const Home: NextPage = () => (
    <Box>
        <Helmet title="Sample Text" />
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
                Simple Social Platform for Everyone
            </Typography>
            <Stack direction="row" alignItems="center" sx={{ mt: 5 }}>
                <Button variant="outlined" component={Link} noLinkStyle href="/signup">Sign Up</Button>
                <Button variant="contained" component={Link} noLinkStyle href="/login" sx={{ ml: 3 }} endIcon={<LoginIcon />}>Login</Button>
            </Stack>
        </Stack>
    </Box>
);

export default Home;
