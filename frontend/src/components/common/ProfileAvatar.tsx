import { Avatar, SxProps, Theme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person'

interface ProfileAvatarProps {
    size?: number,
    picture?: any,
    sx?: SxProps<Theme>
}

const ProfileAvatar = ({ size, picture, sx }: ProfileAvatarProps): JSX.Element => (
    <Avatar sx={{ ...sx, width: size ?? 50, height: size ?? 50 }}>
        {picture ?? <PersonIcon sx={{ fontSize: (size ?? 50) / 2 }} />}
    </Avatar>
)

export default ProfileAvatar
