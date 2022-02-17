import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button,
    Stack,
} from '@mui/material';
import Link from '../src/components/common/Link';
import Helmet from '../src/components/common/Helmet';

const Home: NextPage = () => (
    <Container>
        <Helmet title="Sample Text" />
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '90vh', justifyContent: 'center',
        }}
        >
            <Typography variant="h1">
                SAMPLE Text
            </Typography>
            <Typography variant="h6">
                Simple Social Platform for Everyone
            </Typography>
            <Stack direction="row" alignItems="center" sx={{ mt: 5 }}>
                <Button variant="contained" component={Link} noLinkStyle href="/signup">Create Account</Button>
                <Button variant="contained" component={Link} noLinkStyle href="/login" sx={{ ml: 3 }}>Login</Button>
            </Stack>
        </Box>
    </Container>
);

export default Home;
