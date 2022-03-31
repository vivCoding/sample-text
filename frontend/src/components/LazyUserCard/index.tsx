import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    Card, CardActionArea, CardContent, CardHeader, IconButton, Skeleton, Stack,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProfile } from '../../api/user/profile';
import ProfileAvatar from '../common/ProfileAvatar';

interface LazyUserCardProps {
    userId: string
}

const LazyUserCard = ({ userId }: LazyUserCardProps): JSX.Element => {
    const router = useRouter()

    const [userLoading, setUserLoading] = useState(true)
    const [authorName, setAuthorName] = useState('')
    const [authorPfp, setAuthorPfp] = useState('')

    useEffect(() => {
        const getAuthor = async (): Promise<void> => {
            const res = await getProfile(userId)
            if (res.success && res.data) {
                setAuthorName(res.data.username)
                setAuthorPfp(res.data.profileImg ?? '')
            }
            setUserLoading(false)
        }
        getAuthor()
    }, [userId])

    const handleClick = (): void => {
        router.push(`/profile/${userId}`)
    }

    if (userLoading) {
        return (
            <Card>
                <CardContent>
                    <Skeleton variant="text" height={70} width="50%" />
                    <Stack direction="row" spacing={2}>
                        <Skeleton variant="text" height={30} width="40%" />
                        <Skeleton variant="text" height={30} width="60%" />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Skeleton variant="text" height={30} width="10%" />
                        <Skeleton variant="text" height={30} width="70%" />
                        <Skeleton variant="text" height={30} width="20%" />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Skeleton variant="text" height={30} width="70%" />
                        <Skeleton variant="text" height={30} width="30%" />
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardActionArea>
                <CardHeader
                    avatar={<ProfileAvatar size={25} picture64={authorPfp} />}
                    title={`u/${authorName}`}
                    onClick={handleClick}
                    action={<IconButton><ArrowForwardIcon /></IconButton>}
                />
            </CardActionArea>
        </Card>
    )
}

export default LazyUserCard
