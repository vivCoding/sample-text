import {
    IconButton, InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ChangeEventHandler, useState } from 'react';
import StyledTextField from './StyledTextField';

interface PasswordFieldProps {
    label: string,
    helperText?: string,
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    error?: boolean,
    required?: boolean,
    size?: 'small' | 'medium',
    margin?: 'none' | 'normal' | 'dense',
    sx?: any,
}

const PasswordField = ({
    label, helperText, onChange, error, required, size, margin, sx,
}: PasswordFieldProps): JSX.Element => {
    const [viewPassword, setViewPassword] = useState(false)

    const toggleViewPassword = (): void => {
        setViewPassword(!viewPassword)
    }

    return (
        <StyledTextField
            label={label}
            variant="outlined"
            margin={margin}
            type={viewPassword ? 'text' : 'password'}
            size={size}
            onChange={onChange}
            helperText={helperText}
            error={error ?? false}
            required={required ?? false}
            sx={sx}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={toggleViewPassword}>
                            {viewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default PasswordField
