import {
    Button, Stack, Grid, Container, styled,
} from '@mui/material';
import { useState, ChangeEventHandler } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { convertToBase64, getMb } from '../../utils/image';

import 'react-toastify/dist/ReactToastify.min.css'
import { PFP_LIMIT_MB } from '../../constants/formLimit';

const Input = styled('input')({
    display: 'none',
});

interface PropsType {
    text: string,
    onImageChange?: (img: string) => void
}

const ImageUploadForm = ({ text, onImageChange }: PropsType): JSX.Element => {
    const handleUpload: ChangeEventHandler<HTMLInputElement> = (e): void => {
        if (e.target.files) {
            const file = e.target.files[0]
            if (getMb(file) < PFP_LIMIT_MB) {
                convertToBase64(file, (res) => {
                    if (onImageChange) {
                        onImageChange(res)
                    }
                })
            } else {
                toast.error(
                    <>
                        Your image is too large!
                        <br />
                        Must be
                        {' '}
                        {PFP_LIMIT_MB}
                        MB or less
                    </>,
                    {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                        position: toast.POSITION.BOTTOM_RIGHT,
                    },
                )
            }
        }
    }

    return (
        <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" type="file" onChange={handleUpload} />
            <Button variant="outlined" component="span">
                {text}
            </Button>
            <ToastContainer />
        </label>
    )
}

export default ImageUploadForm
