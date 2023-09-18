import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectLoggedIn, selectUserId, selectShouldFetchData, selectUserAccessToken } from '../redux/slices/user.slice';
import { setShouldFetchData } from '../redux/slices/user.slice';
import { fetchPlayers } from '../redux/slices/players.slice';
import { fetchTournaments } from '../redux/slices/tournaments.slice';
import { fetchADPs } from '../redux/slices/adps.slice';
import { fetchExposureData } from '../redux/slices/exposure.slice';

const useFetchData = () => {
    const loggedIn = useAppSelector(selectLoggedIn);
    const userId = useAppSelector(selectUserId);
    const shouldFetchData = useAppSelector(selectShouldFetchData);
    const accessToken = useAppSelector(selectUserAccessToken);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (loggedIn && userId && shouldFetchData && accessToken) {
            dispatch(fetchExposureData({uid: userId}));
            dispatch(fetchADPs());
            dispatch(fetchPlayers({accessToken: accessToken}));
            dispatch(fetchTournaments());
            dispatch(setShouldFetchData(false));
        }
    }, [loggedIn, userId, shouldFetchData, accessToken]);
};

export default useFetchData;
