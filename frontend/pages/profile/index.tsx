import type { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { ReduxStoreType } from '../../src/types/redux';
import ProfileView from '../../src/components/profile/View';

const CurrentProfilePage: NextPage = () => {
    const { username } = useSelector((state: ReduxStoreType) => state.user)

    return (
        <ProfileView username={username} />
    )
};

export default CurrentProfilePage;
