import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import {
    Box, Typography, Button, Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Link from '../src/components/common/Link';
import AccountForm from '../src/components/AccountForm';

const Home: NextPage = () => (
    <Container sx={{ mt: 10 }}>
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h1">
                SAMPLE Text
            </Typography>
            <Typography variant="h6">
                Simple Social Platform for Everyone
            </Typography>
            <Stack alignItems="center" sx={{ mt: 7 }}>
                <Typography variant="h3">
                    Create Account
                </Typography>
                <Box alignItems="center" sx={{ mt: 5, width: '350px' }}>
                    {/* TODO: add form component */}
                    <AccountForm />
                    <Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'space-between' }}>
                        <Button variant="text" component={Link} noLinkStyle href="/">Login instead</Button>
                        <LoadingButton variant="contained" sx={{ my: 2, ml: 'auto' }}>Continue</LoadingButton>
                    </Box>
                </Box>
            </Stack>
        </Box>
    </Container>
)
export default Home
