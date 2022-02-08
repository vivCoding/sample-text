import {
    Box, Button, IconButton, InputAdornment, Stack, styled, TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import PasswordField from './PasswordField';

const StyledTextfield = styled(TextField)({
    width: '350px',
    maxWidth: '30vw',
})

interface AccountFormProps {
    emailChange?: () => void,
    usernameChange?: () => void,
    passwordChange?: () => void,
    confirmChange?: () => void,
}

const AccountForm = ({
    emailChange, usernameChange, passwordChange, confirmChange,
}: AccountFormProps): JSX.Element => (
    <Stack>
        <StyledTextfield label="Email" variant="outlined" margin="dense" size="small" onChange={emailChange} />
        <StyledTextfield
            label="Username"
            variant="outlined"
            margin="dense"
            size="small"
            helperText="Use up to 20 characters with a mix of letters,
                        numbers, periods, dashes, and underscores"
            onChange={usernameChange}
        />
        <PasswordField
            label="Password"
            helperText="Use 8-25 characters with a mix of letters, numbers, and symbols"
            onChange={passwordChange}
        />
        <PasswordField label="Confirm Password" onChange={confirmChange} />
    </Stack>
)

export default AccountForm
