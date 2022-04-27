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
        // TODO check blocking
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
                    <Skeleton variant="text" height={50} width="50%" />
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
