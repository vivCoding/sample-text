import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import {
    Box, Typography, Button, Stack, styled, LinearProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Link from '../../src/components/common/Link';
import Helmet from '../../src/components/common/Helmet';
import StyledTextField from '../../src/components/common/StyledTextField';
import ProfileAvatar from '../../src/components/common/ProfileAvatar'
import Navbar from '../../src/components/navbar';

const Input = styled('input')({
    display: 'none',
});

const SignupSuccess: NextPage = () => {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    return (
        <Container>
            <Helmet title="Sign Up" />
            <Navbar />
            <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '90vh', justifyContent: 'center',
            }}
            >
                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
                    <Typography variant="h3" fontWeight="300" sx={{ mr: 1 }}>
                        Success!
                    </Typography>
                    <CheckCircleOutlinedIcon sx={{ fontSize: 50, color: 'green' }} />
                </Stack>
                <Typography variant="h5" fontWeight="300">
                    Personalize your profile a little more
                </Typography>
                <Box sx={{ width: '45vw', maxWidth: '350px', mt: 4 }}>
                    <Stack alignItems="center" sx={{ mb: 1.5 }}>
                        <ProfileAvatar size={75} sx={{ mb: 1 }} />
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file" />
                            <Button variant="outlined" component="span">
                                Add Profile Picture
                            </Button>
                        </label>
                    </Stack>
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
                    <Box sx={{
                        display: 'flex', alignItems: 'center', alignContent: 'space-between', width: '100%',
                    }}
                    >
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
