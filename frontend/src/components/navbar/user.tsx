import {
    AppBar, Button, Box, IconButton, Toolbar, Tooltip, Menu, MenuItem, Typography,
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { MouseEventHandler, useState } from 'react';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from '../common/Link'
import { NavBtnStyle, Page } from '.';
import ProfileAvatar from '../common/ProfileAvatar'

const pages: Page[] = [
    {
        label: 'Timeline',
        path: '/',
    },
    {
        label: 'My Posts',
        path: '/',
    },
]

const settings: Page[] = [
    {
        // TODO: set this conditionally?
        label: 'Settings',
        path: '/profile/',
        icon: <SettingsOutlinedIcon />,
    },
    {
        label: 'Log Out',
        path: '/',
        icon: <LogoutIcon />,
    },
]

const Navbar = (): JSX.Element => {
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [anchorElUser, setAnchorElUser]: [Element | undefined, any] = useState(undefined)

    const handleOpenUserMenu: MouseEventHandler<HTMLButtonElement> = (e) => {
        setAnchorElUser(e.currentTarget)
        setShowUserMenu(true)
    }

    const handleCloseUserMenu = (): void => {
        setShowUserMenu(false)
    }

    return (
        <AppBar
            color="transparent"
            enableColorOnDark
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justfiyContent: 'center',
                alignItems: 'center',
                px: 2,
                backgroundColor: '#282828',
            }}
        >
            <Toolbar disableGutters sx={{ width: '100%' }}>
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
                    <Tooltip title="Open Menu" sx={{ mx: 2 }}>
                        <IconButton onClick={handleOpenUserMenu}>
                            <ProfileAvatar size={40} />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={showUserMenu}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem key={setting.label} onClick={handleCloseUserMenu}>
                                <Button
                                    component={Link}
                                    noLinkStyle
                                    href={setting.path}
                                    sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0)' }}
                                    startIcon={setting.icon}
                                >
                                    {setting.label}
                                </Button>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
