import {
    AppBar, Button, Box, IconButton, Toolbar, createStyles, Container,
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import LoginIcon from '@mui/icons-material/Login';
import Link from '../common/Link'

export const NavBtnStyle = createStyles({
    color: 'white',
    mx: 1,
    py: 2,
    '&:hover': {
        backgroundColor: '#424242',
    },
})

export interface Page {
    label: string,
    path: string,
    icon?: JSX.Element
}

const pages: Page[] = [
    {
        label: 'Home',
        path: '/',
    },
    {
        label: 'About',
        path: '/',
    },
]

const Navbar = (): JSX.Element => (
    <AppBar
        position="static"
        color="transparent"
        enableColorOnDark
        sx={{
            px: 2,
            backgroundColor: '#282828',
            left: 0,
            right: 0,
        }}
    >
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <IconButton
                    component={Link}
                    noLinkStyle
                    href="/"
                    sx={{
                        mr: 2, color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0)' },
                    }}
                >
                    <TextFieldsIcon fontSize="large" />
                </IconButton>
                <Box sx={{ ml: 'auto' }}>
                    {pages.map((page) => (
                        <Button key={page.label} component={Link} noLinkStyle href={page.path} sx={NavBtnStyle}>
                            {page.label}
                        </Button>
                    ))}
                    <Button
                        variant="outlined"
                        component={Link}
                        noLinkStyle
                        href="/login"
                        sx={{
                            color: 'white',
                            mx: 2,
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                                borderColor: 'white',
                            },
                        }}
                        endIcon={<LoginIcon />}
                    >
                        Login
                    </Button>
                </Box>
            </Toolbar>
        </Container>
    </AppBar>
)

export default Navbar
