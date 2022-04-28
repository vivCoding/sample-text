import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    Card, CardActionArea, CardContent, CardHeader, IconButton, Skeleton,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProfile } from '../../api/user/profile';
import ProfileAvatar from '../common/ProfileAvatar';

interface LazyUserCardProps {
    userId: string
}

const LazyUserCard = ({ userId }: LazyUserCardProps): JSX.Element | null => {
    const router = useRouter()

    const [userLoading, setUserLoading] = useState(true)
    const [authorName, setAuthorName] = useState('')
    const [authorPfp, setAuthorPfp] = useState('')
    const [shouldShow, setShouldShow] = useState(false)

    useEffect(() => {
        const getAuthor = async (): Promise<void> => {
            const res = await getProfile(userId)
            if (res.success && res.data) {
                setAuthorName(res.data.username)
                setAuthorPfp(res.data.profileImg ?? '')
                setShouldShow(true)
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

    if (!shouldShow) return null

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
