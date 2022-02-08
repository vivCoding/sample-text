import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button,
    Stack, styled, TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Link from '../src/components/common/Link';

const StyledTextfield = styled(TextField)({
    width: '350px',
    maxWidth: '30vw',
})

const Home: NextPage = () => (
    <Container sx={{ mt: 20, px: 5 }}>
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h1">
                SAMPLE Text
            </Typography>
            <Typography variant="h6">
                Simple Social Platform for Everyone
            </Typography>
            <Stack sx={{ mt: 7 }} alignItems="center">
                <Typography variant="h3">
                    Login
                </Typography>
                <Box alignItems="center" sx={{ width: '350px' }}>
                    <StyledTextfield
                        label="Username or Email"
                        variant="outlined"
                        margin="normal"
                    />
                    <StyledTextfield label="Password" variant="outlined" margin="dense" />
                    <Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'space-between' }}>
                        <Button variant="text" component={Link} noLinkStyle href="/signup">Create Account</Button>
                        <LoadingButton variant="contained" sx={{ my: 2, ml: 'auto' }}>Login</LoadingButton>
                    </Box>
                </Box>
            </Stack>
        </Box>
    </Container>
);

export default Home;
