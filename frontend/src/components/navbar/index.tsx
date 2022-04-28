import LoginIcon from '@mui/icons-material/Login';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import {
    AppBar, Box, Button, createStyles, IconButton, Toolbar, Tooltip, useTheme,
} from '@mui/material';
import Link from '../common/Link';
import ModeSwitch from '../common/ModeSwitch';

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
        path: '/about',
    },
]

const Navbar = (): JSX.Element => {
    const theme = useTheme()

    return (
        <AppBar
            position="sticky"
            color="transparent"
            enableColorOnDark
            sx={{
                px: 3,
                backgroundColor: theme.palette.mode === 'dark' ? '#282828' : '#FFFFFF',
            }}
        >
            <Toolbar disableGutters>
                <IconButton
                    component={Link}
                    noLinkStyle
                    href="/"
                    sx={{
                        px: 3,
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0)',
                        },
                    }}
                >
                    <TextFieldsIcon fontSize="large" />
                </IconButton>
                <Box sx={{ ml: 'auto' }}>
                    {pages.map((page) => (
                        <Button
                            key={page.label}
                            component={Link}
                            noLinkStyle
                            href={page.path}
                            sx={{
                                color: theme.palette.text.primary,
                                mx: 1,
                                py: 2,
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#efefef',
                                },
                            }}
                        >
                            {page.label}
                        </Button>
                    ))}
                    <Tooltip title="Toggle Color Scheme" sx={{ mx: 1 }}>
                        <ModeSwitch />
                    </Tooltip>
                    <Button
                        variant="outlined"
                        component={Link}
                        noLinkStyle
                        href="/login"
                        sx={{
                            color: theme.palette.text.primary,
                            mx: 2,
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
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
        </AppBar>
    )
}

export default Navbar
