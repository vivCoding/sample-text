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
    caption: string,
    img: string,
    anonymous: boolean
}

const CreatePostPage: NextPage = () => {
    const { username } = useSelector((state: ReduxStoreType) => state.user)
    const dispatch = useDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(username === undefined)
    const [postValue, setPostValue] = useState({
        title: '', caption: '', img: '', anonymous: false,
    } as FormType)
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

    const handleCaptionChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPostValue({ ...postValue, caption: e.target.value })
    }

    const handleImageChange = (img: string): void => {
        setPostValue({ ...postValue, img })
    }

    const handleRemoveImage = (): void => {
        setPostValue({ ...postValue, img: '' })
    }

    const handleCancelButton = (): void => {
        router.back()
    }

    const handleCreateButton = (): void => {
        setCreateLoading(true)
        createPost(postValue).then((res) => {
            if (res.success && res.data) {
                router.push(`/post/${res.data.postId}`)
            } else {
                toast.error(`Could not create post: ${res.errorMessage ?? ''}!`)
            }
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
                        placeholder="Title your post something memorable"
                        error={postValue.title.length > LENGTH_LIMIT.POST.TITLE}
                        helperText={`${postValue.title.length} / ${LENGTH_LIMIT.POST.TITLE}`}
                        onChange={handleTitleChange}
                    />
                    <StyledTextField
                        label="Body"
                        placeholder="Give your post a story"
                        error={postValue.caption.length > LENGTH_LIMIT.POST.BODY}
                        helperText={`${postValue.caption.length} / ${LENGTH_LIMIT.POST.BODY}`}
                        multiline
                        minRows={6}
                        onChange={handleCaptionChange}
                        sx={{ mt: 2 }}
                    />
                    {/* TODO: make toggle anonymous button */}
                    <Box sx={{ mt: 2 }}>
                        {postValue.img !== '' && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={postValue.img} style={{ maxWidth: '100%', maxHeight: '20em' }} alt="Uploaded" />
                        )}
                        <Stack direction="row" sx={{ mt: 1 }}>
                            <ImageUploadForm text="Attach Image" onImageChange={handleImageChange} sizeLimit={IMG_LIMIT_MB} />
                            {postValue.img !== '' && <Button sx={{ ml: 2 }} onClick={handleRemoveImage}>Remove</Button>}
                        </Stack>
                    </Box>
                    <Stack direction="row" sx={{ mt: 1, width: '100%' }} justifyContent="flex-end">
                        <Button onClick={handleCancelButton}>Cancel</Button>
                        <LoadingButton
                            variant="contained"
                            sx={{ ml: 2 }}
                            loading={createLoading}
                            onClick={handleCreateButton}
                            disabled={postValue.title.length === 0 || postValue.title.length > LENGTH_LIMIT.POST.TITLE || postValue.caption.length > LENGTH_LIMIT.POST.BODY}
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