import {
    Button,
    Stack,
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Helmet from '../src/components/common/Helmet';
import Link from '../src/components/common/Link';

const Home: NextPage = () => (
    <Box>
        <Helmet title="404 | SAMPLE Text" />
        <Stack sx={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '90vh',
        }}
        >
            <Typography variant="h1">
                SAMPLE Text
            </Typography>
            <Typography variant="h2" sx={{ mt: 3, mb: 3 }}>
                404 Not Found :(
            </Typography>
            <Typography variant="h6">
                The page you were looking could not found
            </Typography>
            <Button variant="contained" component={Link} sx={{ mt: 7 }} href="/">Return to Home Page</Button>
        </Stack>
    </Box>
);

export default Home;
