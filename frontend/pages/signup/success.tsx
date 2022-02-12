import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import {
    Box, Typography, Button, Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Link from '../../src/components/common/Link';
import Helmet from '../../src/components/common/Helmet';
import StyledTextField from '../../src/components/common/StyledTextField';

const SignupSuccess: NextPage = () => {
    const [name, setName] = useState('')

    return (
        <Container sx={{ mt: 10 }}>
            <Helmet title="Sign Up" />
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
                <Box alignItems="center" sx={{ width: '350px', mt: 6 }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
                        <Typography variant="h3" fontWeight="300" sx={{ mr: 1 }}>
                            Success!
                        </Typography>
                        <CheckCircleOutlinedIcon sx={{ fontSize: 50, color: 'green' }} />
                    </Stack>
                    <Typography variant="h6" fontWeight="300" sx={{ mb: 2 }}>
                        Personalize your profile a little more!
                    </Typography>
                    <StyledTextField
                        label="Name"
                        variant="outlined"
                        margin="dense"
                        size="medium"
                        placeholder="Your display name"
                    />
                    <StyledTextField
                        label="Bio"
                        variant="outlined"
                        margin="dense"
                        size="medium"
                        placeholder="Something about yourself"
                        multiline
                        minRows={3}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'space-between' }}>
                        <Button variant="text" component={Link} noLinkStyle href="/">Skip for Now</Button>
                        <LoadingButton
                            variant="contained"
                            sx={{ my: 2, ml: 'auto' }}
                            component={Link}
                            noLinkStyle
                            href="/"
                        >
                            Finish
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}

export default SignupSuccess
