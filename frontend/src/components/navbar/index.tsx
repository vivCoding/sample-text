import {
    AppBar, Button, Box, createStyles, IconButton,
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Link from '../common/Link'

const navBtnStyle = createStyles({
    color: 'white',
    mx: 2,
    py: 2,
})

const pages = [
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
        sx={{
            display: 'flex', flexDirection: 'row', justfiyContent: 'center', alignItems: 'center', px: 2,
        }}
    >
        <IconButton component={Link} noLinkStyle href="/" sx={{ mr: 2, '&:hover': { backgroundColor: 'rgba(0,0,0,0)' } }}>
            <TextFieldsIcon fontSize="large" />
        </IconButton>
        <Box>
            {pages.map((page) => (
                <Button key={page.label} component={Link} noLinkStyle href={page.path} sx={navBtnStyle}>
                    {page.label}
                </Button>
            ))}
        </Box>
        <Box sx={{ ml: 'auto' }}>
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
            >
                Login

            </Button>
        </Box>
    </AppBar>
)

export default Navbar
