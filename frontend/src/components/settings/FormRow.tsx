import Typography from '@mui/material/Typography';
import { IconButton, InputAdornment, Grid } from '@mui/material';
import { ChangeEventHandler, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import StyledTextField from '../common/StyledTextField';

import 'react-toastify/dist/ReactToastify.min.css'

const FormRow = ({
    title, value, onSave, multiline, disabled, charLimit,
}: { title: string, value?: string, onSave?: (val: string) => boolean, multiline?: boolean, disabled?: boolean, charLimit?: number }): JSX.Element => {
    const [editing, setEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)

    const handleValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setEditValue(e.target.value)
    }

    return (
        <>
            <Grid item xs={5}>
                <Typography variant="h6">{title}</Typography>
            </Grid>
            <Grid item xs={6}>
                {editing ? (
                    <StyledTextField
                        size="small"
                        defaultValue={value}
                        multiline={multiline}
                        minRows={(multiline ?? false) ? 3 : 1}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" sx={{ pr: 0 }}>
                                    <IconButton title="Cancel Changes" onClick={() => setEditing(false)}>
                                        <CancelIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={charLimit !== undefined && editValue !== undefined && editValue.length > charLimit}
                        helperText={charLimit ? `${(editValue && editValue.length) ?? 0} / ${charLimit}` : undefined}
                        sx={{ pr: 0 }}
                        onChange={handleValueChange}
                    />
                ) : <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>{value ?? ''}</Typography>}
            </Grid>
            <Grid item xs={1}>
                {editing ? (
                    <IconButton
                        sx={{ ml: 1 }}
                        title={`Save ${title}`}
                        disabled={disabled || (charLimit !== undefined && editValue !== undefined && editValue.length > charLimit)}
                        onClick={() => onSave && onSave(editValue ?? '') && setEditing(false)}
                    >
                        <SaveIcon />
                    </IconButton>
                ) : (
                    <IconButton sx={{ ml: 1 }} title="Change Username" onClick={() => setEditing(true)}>
                        <EditIcon />
                    </IconButton>
                )}
            </Grid>
        </>
    )
}

export default FormRow
