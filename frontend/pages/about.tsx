import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button,
    Stack, Container,
} from '@mui/material';
import Helmet from '../src/components/common/Helmet';
import Navbar from '../src/components/navbar';

const AboutPage: NextPage = () => (
    <Box>
        <Helmet title="About Sample Text" />
        <Navbar />
        <Container sx={{ mt: 15 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
                About
            </Typography>
            <Typography sx={{ mb: 3 }}>
                Sample Text serves to be an example of what a featurable and user intuitive social media platform should be.
            </Typography>
            <Typography sx={{ mb: 1 }}>
                Created by Purdue students in CS 307 - Software Engineering I
                <ul>
                    <li>Ryan Chu</li>
                    <li>Aldiyar Orak</li>
                    <li>Devin Qu</li>
                    <li>Vincent Vu</li>
                    <li>Evan Yang</li>
                </ul>
            </Typography>
            <Typography sx={{ mb: 1 }}>
                View on
                {' '}
                <a href="https://github.com/vivCoding/sample-text" style={{ color: 'cyan' }} target="_blank" rel="noreferrer">GitHub</a>
            </Typography>
        </Container>
    </Box>
);

export default AboutPage;
