import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectLoggedIn, selectShouldFetchData, selectUserAccessToken, fetchReplacementRules } from '../redux/slices/user.slice';
import { setShouldFetchData } from '../redux/slices/user.slice';
import { fetchADPs } from '../redux/slices/adps.slice';
import { fetchExposureData, selectShouldRefreshData, setShouldRefreshData } from '../redux/slices/exposure.slice';

const useFetchData = () => {
    const loggedIn = useAppSelector(selectLoggedIn);
    const shouldFetchData = useAppSelector(selectShouldFetchData);
    const shouldRefreshData = useAppSelector(selectShouldRefreshData);
    const accessToken = useAppSelector(selectUserAccessToken);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (loggedIn && (shouldFetchData || shouldRefreshData) && accessToken) {
            dispatch(fetchExposureData({}));
            dispatch(fetchADPs({}));
            dispatch(fetchReplacementRules({}));
            dispatch(setShouldFetchData(false));
            dispatch(setShouldRefreshData(false));
        }
    }, [loggedIn, shouldFetchData, accessToken, shouldRefreshData]);
};

export default useFetchData;
