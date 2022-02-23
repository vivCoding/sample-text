import {
    Avatar, SxProps, Theme, Skeleton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person'

interface ProfileAvatarProps {
    size?: number,
    picture64?: string,
    sx?: SxProps<Theme>
    loading?: boolean
}

const ProfileAvatar = ({
    size, picture64, sx, loading,
}: ProfileAvatarProps): JSX.Element => {
    if (loading) return <Skeleton animation="wave" variant="circular" width={size} height={size} />
    return (
        <Avatar sx={{ ...sx, width: size ?? 50, height: size ?? 50 }} src={picture64}>
            {(!picture64 || picture64 === '') && <PersonIcon sx={{ fontSize: (size ?? 50) / 2 }} />}
        </Avatar>
    )
}

export default ProfileAvatar
