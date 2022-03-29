import {
    AppBar, Button, IconButton, Toolbar, Tooltip, Menu, MenuItem, Badge, Typography, Skeleton, Stack, Backdrop, CircularProgress,
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { MouseEventHandler, useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from '../common/Link'
import { NavBtnStyle, Page } from '.';
import ProfileAvatar from '../common/ProfileAvatar'
import { ReduxStoreType } from '../../types/redux';
import { logoutUser } from '../../api/user';

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
        label: 'Settings',
        path: '/settings',
        icon: <SettingsOutlinedIcon />,
    },
]

const Navbar = (): JSX.Element => {
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [anchorElUser, setAnchorElUser]: [Element | undefined, any] = useState(undefined)

    const { username, profileImg } = useSelector((state: ReduxStoreType) => state.user)
    const router = useRouter()

    const [loadingLogout, setLogoutLoading] = useState(false)

    const handleOpenUserMenu: MouseEventHandler<HTMLButtonElement> = (e) => {
        if (username !== undefined) {
            setAnchorElUser(e.currentTarget)
            setShowUserMenu(true)
        }
    }

    const handleCloseUserMenu = (): void => {
        setShowUserMenu(false)
    }

    const handleLogout = (): void => {
        setLogoutLoading(true)
        logoutUser().then((res) => {
            if (res.success) {
                router.push('/')
            } else if (res.error === 401) {
                router.push('/401')
            } else {
                router.push('/404')
            }
            setLogoutLoading(false)
        })
    }

    const handleGoCreate = (): void => {
        router.push('/post/create')
    }

    return (
        <>
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
                    <Tooltip
                        title="Timeline"
                        sx={{
                            mr: 2, color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0)' },
                        }}
                    >
                        <IconButton component={Link} noLinkStyle href="/timeline">
                            <TextFieldsIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <Stack direction="row" alignItems="center" sx={{ ml: 'auto' }}>
                        {pages.map((page) => (
                            <Button key={page.label} component={Link} noLinkStyle href={page.path} sx={NavBtnStyle}>
                                {page.label}
                            </Button>
                        ))}
                        {/* <Tooltip title="Friend Requests" sx={{ mx: 1 }}>
                            <IconButton>
                                <Badge color="primary" badgeContent={2}>
                                    <PersonAddIcon color="action" />
                                </Badge>
                            </IconButton>
                        </Tooltip> */}
                        <Tooltip title="Create Post" sx={{ mx: 1 }}>
                            <IconButton onClick={handleGoCreate}>
                                <AddBoxIcon />
                            </IconButton>
                        </Tooltip>
                        {username
                            ? (
                                <Tooltip title="My Profile">
                                    <Typography
                                        display="inline-block"
                                        onClick={() => router.push(`/profile/${username}`)}
                                        sx={{ mx: 1, '&:hover': { cursor: 'pointer' } }}
                                    >
                                        u/
                                        {username}
                                    </Typography>
                                </Tooltip>
                            )
                            : (
                                <Skeleton width={150} height={40} sx={{ display: 'inline-block', mx: 1 }} />
                            )}
                        <Tooltip title="Open Menu" sx={{ mx: 1 }}>
                            <IconButton onClick={handleOpenUserMenu}>
                                <ProfileAvatar size={40} picture64={profileImg} loading={username === undefined} />
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
                            <MenuItem>
                                <Button
                                    component={Link}
                                    noLinkStyle
                                    href={`/profile/${username}`}
                                    sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0)' } }}
                                    startIcon={<PersonIcon />}
                                >
                                    My Profile
                                </Button>
                            </MenuItem>
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
                            <MenuItem onClick={handleLogout}>
                                <Button
                                    sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0)' } }}
                                    startIcon={<LogoutIcon />}
                                >
                                    Logout
                                </Button>
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingLogout}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export default Navbar
