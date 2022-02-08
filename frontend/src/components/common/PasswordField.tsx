import {
    IconButton, InputAdornment, styled, TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ChangeEventHandler, useState } from 'react';

const StyledTextfield = styled(TextField)({
    width: '350px',
    maxWidth: '30vw',
})

interface PasswordFieldProps {
    label: string,
    helperText?: string,
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    error?: boolean,
    required?: boolean,
}

const PasswordField = ({
    label, helperText, onChange, error, required,
}: PasswordFieldProps): JSX.Element => {
    const [viewPassword, setViewPassword] = useState(false)

    const toggleViewPassword = (): void => {
        setViewPassword(!viewPassword)
    }

    return (
        <StyledTextfield
            label={label}
            variant="outlined"
            margin="dense"
            type={viewPassword ? 'text' : 'password'}
            size="small"
            onChange={onChange}
            helperText={helperText}
            error={error ?? false}
            required={required ?? false}
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
