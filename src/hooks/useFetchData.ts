import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectLoggedIn, selectUserId, selectShouldFetchData, selectUserAccessToken, fetchReplacementRules } from '../redux/slices/user.slice';
import { setShouldFetchData } from '../redux/slices/user.slice';
import { fetchADPs } from '../redux/slices/adps.slice';
import { fetchExposureData, selectShouldRefreshData, setShouldRefreshData } from '../redux/slices/exposure.slice';

const useFetchData = () => {
    const loggedIn = useAppSelector(selectLoggedIn);
    const userId = useAppSelector(selectUserId);
    const shouldFetchData = useAppSelector(selectShouldFetchData);
    const shouldRefreshData = useAppSelector(selectShouldRefreshData);
    const accessToken = useAppSelector(selectUserAccessToken);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (loggedIn && userId && (shouldFetchData || shouldRefreshData) && accessToken) {
            dispatch(fetchExposureData({}));
            dispatch(fetchADPs({}));
            dispatch(fetchReplacementRules({}));
            dispatch(setShouldFetchData(false));
            dispatch(setShouldRefreshData(false));
        }
    }, [loggedIn, userId, shouldFetchData, accessToken, shouldRefreshData]);
};

export default useFetchData;
