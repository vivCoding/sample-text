import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Button, Stack, Container, CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, ChangeEventHandler } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Helmet from '../../src/components/common/Helmet';
import UserNavbar from '../../src/components/navbar/user';
import { ReduxStoreType } from '../../src/types/redux';
import { getUser } from '../../src/api/user';
import { setCurrentUser } from '../../src/store';
import StyledTextField from '../../src/components/common/StyledTextField';
import { LENGTH_LIMIT, IMG_LIMIT_MB } from '../../src/constants/formLimit';
import ImageUploadForm from '../../src/components/common/ImageUpload';
import { createPost } from '../../src/api/post';

interface FormType {
    title: string,
    body: string,
    image: string,
}

const CreatePostPage: NextPage = () => {
    const { username } = useSelector((state: ReduxStoreType) => state.user)
    const dispatch = useDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(username === undefined)
    const [error, setError] = useState({ title: '', body: '' } as FormType)
    const [postValue, setPostValue] = useState({ title: '', body: '', image: '' } as FormType)
    const [createLoading, setCreateLoading] = useState(false)

    useEffect(() => {
        if (!username) {
            getUser().then((res) => {
                if (res.success && res.data) {
                    dispatch(setCurrentUser(res.data))
                } else if (res.error === 401) {
                    router.push('/401')
                } else {
                    router.push('/404')
                }
                setLoading(false)
            })
        }
    }, [router, dispatch, username])

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPostValue({ ...postValue, title: e.target.value })
    }

    const handleBodyChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPostValue({ ...postValue, body: e.target.value })
    }

    const handleImageChange = (image: string): void => {
        setPostValue({ ...postValue, image })
    }

    const handleRemoveImage = (): void => {
        setPostValue({ ...postValue, image: '' })
    }

    const handleCancelButton = (): void => {
        router.back()
    }

    const handleCreateButton = (): void => {
        setCreateLoading(true)
        createPost({ title: postValue.title, caption: postValue.body, img: postValue.image }).then((res) => {
            setCreateLoading(false)
        })
    }

    if (loading) {
        return (
            <Box>
                <Helmet title="Create Post" />
                <UserNavbar />
                <Box sx={{
                    display: 'flex', height: '90vh', alignItems: 'center', justifyContent: 'center',
                }}
                >
                    <CircularProgress />
                </Box>
            </Box>
        )
    }

    return (
        <Box>
            <Helmet title="Create Post" />
            <UserNavbar />
            <ToastContainer />
            <Container maxWidth="md" sx={{ mt: 6, mb: 20 }}>
                <Typography variant="h3" fontWeight="300" sx={{ mr: 1, textAlign: 'center', width: '100%' }}>
                    Create Post
                </Typography>
                <Container maxWidth="md" sx={{ mt: 6 }}>
                    <StyledTextField
                        label="Title"
                        placeholder="Title your post something bold!"
                        error={error.title !== '' || postValue.title.length > LENGTH_LIMIT.POST.TITLE}
                        helperText={`${error.title !== '' ? `${error.title} ` : ''}${postValue.title.length} / ${LENGTH_LIMIT.POST.TITLE}`}
                        onChange={handleTitleChange}
                    />
                    <StyledTextField
                        label="Body"
                        placeholder="Give your post a story!"
                        error={error.body !== '' || postValue.body.length > LENGTH_LIMIT.POST.BODY}
                        helperText={`${error.body !== '' ? `${error.body} ` : ' '}${postValue.body.length} / ${LENGTH_LIMIT.POST.BODY}`}
                        multiline
                        minRows={6}
                        onChange={handleBodyChange}
                        sx={{ mt: 2 }}
                    />
                    <Box sx={{ mt: 2 }}>
                        {postValue.image !== '' && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={postValue.image} style={{ maxWidth: '100%', maxHeight: '20em' }} alt="Uploaded" />
                        )}
                        <Stack direction="row" sx={{ mt: 1 }}>
                            <ImageUploadForm text="Attach Image" onImageChange={handleImageChange} sizeLimit={IMG_LIMIT_MB} />
                            {postValue.image !== '' && <Button sx={{ ml: 2 }} onClick={handleRemoveImage}>Remove</Button>}
                        </Stack>
                    </Box>
                    <Stack direction="row" sx={{ mt: 1, width: '100%' }} justifyContent="flex-end">
                        <Button onClick={handleCancelButton}>Cancel</Button>
                        <LoadingButton
                            variant="contained"
                            sx={{ ml: 2 }}
                            loading={createLoading}
                            onClick={handleCreateButton}
                            disabled={postValue.title.length === 0 || postValue.title.length > LENGTH_LIMIT.POST.TITLE || postValue.body.length > LENGTH_LIMIT.POST.BODY}
                        >
                            Create
                        </LoadingButton>
                    </Stack>
                </Container>
            </Container>
        </Box>
    )
};

export default CreatePostPage;
