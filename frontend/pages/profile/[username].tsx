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
import Navbar from '../../src/components/navbar/user';

const Home: NextPage = () => (
    <Container>
        <Helmet title="Sample Text" />
        <Navbar />
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '90vh', justifyContent: 'center',
        }}
        >
            <Typography variant="h3">
                User profile
            </Typography>
        </Box>
    </Container>
);

export default Home;
