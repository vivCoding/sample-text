import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import ProfileView from '../../src/components/profile/View';

const UserProfilePage: NextPage = () => {
    const { query } = useRouter()

    return (
        <ProfileView username={query.username as string} />
    )
};

export default UserProfilePage;
