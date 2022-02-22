import {
    AppBar, Button, Box, IconButton, Toolbar, Tooltip, Menu, MenuItem, Badge,
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { MouseEventHandler, useState } from 'react';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Link from '../common/Link'
import { NavBtnStyle, Page } from '.';
import ProfileAvatar from '../common/ProfileAvatar'

const pages: Page[] = [
    // {
    //     label: 'Timeline',
    //     path: '/',
    // },
    // {
    //     label: 'My Posts',
    //     path: '/',
    // },
]

const settings: Page[] = [
    {
        // TODO: set this conditionally?
        label: 'My Profile',
        path: '/profile',
        icon: <PersonIcon />,
    },
    {
        label: 'Settings',
        path: '/settings',
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
            position="sticky"
            color="transparent"
            enableColorOnDark
            sx={{
                px: 3,
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
                    <Tooltip title="Friend Requests" sx={{ mx: 1 }}>
                        <IconButton>
                            <Badge color="primary">
                                <PersonAddIcon color="action" />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Notifications" sx={{ mx: 1 }}>
                        <IconButton>
                            <Badge badgeContent={4} color="primary">
                                <NotificationsIcon color="action" />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Open Menu" sx={{ mx: 1 }}>
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
                                    sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0)' } }}
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
