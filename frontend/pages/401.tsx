import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button,
    Stack,
} from '@mui/material';
import Link from '../src/components/common/Link';
import Helmet from '../src/components/common/Helmet';

const Home: NextPage = () => (
    <Box>
        <Helmet title="401 | Sample Text" />
        <Stack sx={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '90vh',
        }}
        >
            <Typography variant="h1">
                SAMPLE Text
            </Typography>
            <Typography variant="h2" sx={{ mt: 3 }}>
                Unauthorized
            </Typography>
            <Typography variant="h6">
                You must be logged in to access this page
            </Typography>
            <Button variant="contained" component={Link} sx={{ mt: 7 }} href="/">Return to Home Page</Button>
        </Stack>
    </Box>
);

export default Home;
