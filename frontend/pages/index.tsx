import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button,
    Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Link from '../src/components/common/Link';
import Helmet from '../src/components/common/Helmet';
import StyledTextField from '../src/components/common/StyledTextField';

const Home: NextPage = () => (
    <Container sx={{ mt: 20, px: 5 }}>
        <Helmet title="Login" />
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}
        >
            <Typography variant="h1">
                SAMPLE Text
            </Typography>
            <Typography variant="h6">
                Simple Social Platform for Everyone
            </Typography>
            <Box alignItems="center" sx={{ width: '350px', mt: 7 }}>
                <Typography variant="h3">
                    Login
                </Typography>
                <Stack>
                    <StyledTextField
                        label="Username or Email"
                        variant="outlined"
                        margin="normal"
                    />
                    <StyledTextField label="Password" variant="outlined" margin="dense" />
                    <Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'space-between' }}>
                        <Button variant="text" component={Link} noLinkStyle href="/signup">Create Account</Button>
                        <LoadingButton variant="contained" sx={{ my: 2, ml: 'auto' }}>Login</LoadingButton>
                    </Box>
                </Stack>
            </Box>
        </Box>
    </Container>
);

export default Home;
