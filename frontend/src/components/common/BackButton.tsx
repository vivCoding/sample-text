import { Button, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

interface BackButtonProps {
    text?: string
}

const BackButton = ({ text = 'Back' }: BackButtonProps): JSX.Element => {
    const router = useRouter()

    const handleBack = (): void => {
        router.back();
    }

    return (
        <Button onClick={handleBack}>
            <Stack direction="row">
                <ArrowBackIosIcon />
                {text}
            </Stack>
        </Button>
    )
}

export default BackButton
