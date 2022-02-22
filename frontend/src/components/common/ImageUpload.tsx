import {
    Button, Stack, Grid, Container, styled,
} from '@mui/material';
import { useState } from 'react'

const Input = styled('input')({
    display: 'none',
});

interface PropsType {
    text: string,
    onImageChange?: any
}

const ImageUploadForm = ({ text, onImageChange }: PropsType): JSX.Element => {
    const [image, setImage] = useState('')

    const handleUpload = (): void => {}

    return (
        <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" type="file" />
            <Button variant="outlined" component="span">
                {text}
            </Button>
        </label>
    )
}

export default ImageUploadForm
