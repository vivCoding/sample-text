import {
    AppBar, Button,
    Box, IconButton, Toolbar, Tooltip, Menu, MenuItem, Badge,
    Typography, Skeleton, Stack, Backdrop, CircularProgress, TextField, styled, alpha, InputBase, InputAdornment, Popper, Autocomplete,
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { ChangeEventHandler, MouseEventHandler, useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TagIcon from '@mui/icons-material/Tag';
import { PanoramaFishEyeSharp } from '@mui/icons-material';
import Link from '../common/Link'
import { NavBtnStyle, Page } from '.';
import ProfileAvatar from '../common/ProfileAvatar'
import { ReduxStoreType } from '../../types/redux';
import { logoutUser } from '../../api/user';
import { getProfile } from '../../api/user/profile';
import { getTopic } from '../../api/topic';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    transition: '0.2s',
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.20),
        transition: '0.2s',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '150%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '40ch',
        },
    },
}));

const settings: Page[] = [
    {
        label: 'Settings',
        path: '/settings',
        icon: <SettingsOutlinedIcon />,
    },
]

const Navbar = (): JSX.Element => {
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [menuAnchorEl, setMenuAnchorEl]: [Element | undefined, any] = useState(undefined)

    const { username, profileImg } = useSelector((state: ReduxStoreType) => state.user)
    const router = useRouter()

    const [loadingLogout, setLogoutLoading] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [searchResults, setSearchResults] = useState([] as { type: string, data: string }[])
    const [searchLoading, setSearchLoading] = useState(false)

    const handleOpenUserMenu: MouseEventHandler<HTMLButtonElement> = (e) => {
        if (username !== undefined) {
            setMenuAnchorEl(e.currentTarget)
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

    const handleSearchChange = async (): Promise<void> => {
        if (searchValue === '') return
        setSearchLoading(true)
        const results = []
        const userRes = await getProfile(searchValue)
        if (userRes.success && userRes.data) {
            results.push({ type: 'user', data: userRes.data.username })
        }
        const topicRes = await getTopic(searchValue)
        if (topicRes.success && topicRes.data) {
            results.push({ type: 'topic', data: topicRes.data.topic })
        }
        setSearchResults(results)
        setSearchLoading(false)
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
                    <Autocomplete
                        disablePortal
                        blurOnSelect
                        onInputChange={(_, searchString, reason) => {
                            if (reason !== 'input' && reason !== 'clear') return
                            setSearchValue(searchString || '')
                        }}
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                handleSearchChange()
                                ev.preventDefault()
                            }
                        }}
                        getOptionLabel={(option) => option.data}
                        options={searchResults}
                        loadingText="Loading..."
                        loading={searchLoading}
                        renderOption={(props, option, __) => (
                            <Button
                                component={Link}
                                noLinkStyle
                                href={option.type === 'user' ? `/profile/${option.data}` : `/topic/${option.data}`}
                                sx={{
                                    color: 'white', width: '100%', display: 'flex', p: 2, justifyContent: 'flex-start',
                                }}
                                startIcon={option.type === 'user' ? <PersonIcon /> : <TagIcon />}
                            >
                                {option.data}
                            </Button>
                        )}
                        noOptionsText="No results"
                        renderInput={(params) => (
                            <Search ref={params.InputProps.ref}>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    {...params}
                                    placeholder="Search Users or Topics"
                                />
                            </Search>
                        )}
                    />
                    <Stack direction="row" alignItems="center" sx={{ ml: 'auto' }}>
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
                            anchorEl={menuAnchorEl}
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
