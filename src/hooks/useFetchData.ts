import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectLoggedIn, selectShouldFetchData, selectUserAccessToken,
    setShouldFetchData, selectUserIsAdmin } from '../redux/slices/user.slice';
import { fetchADPs } from '../redux/slices/adps.slice';
import { fetchExposureData, selectShouldRefreshData, setShouldRefreshData } from '../redux/slices/exposure.slice';
import { fetchRookieDefinitions, fetchReplacementRules, fetchUserInfo } from '../redux/slices/admin.slice';

const useFetchData = () => {
    const loggedIn: boolean = useAppSelector(selectLoggedIn);
    const isAdmin: boolean = useAppSelector(selectUserIsAdmin);
    const shouldFetchData: boolean = useAppSelector(selectShouldFetchData);
    const shouldRefreshData: boolean = useAppSelector(selectShouldRefreshData);
    const accessToken: string = useAppSelector(selectUserAccessToken);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (loggedIn && (shouldFetchData || shouldRefreshData) && accessToken) {
            dispatch(fetchExposureData({}));
            dispatch(fetchADPs({}));
            dispatch(setShouldFetchData(false));
            dispatch(setShouldRefreshData(false));
            /* Admin Functionality */
            if (isAdmin) {
                dispatch(fetchReplacementRules({}));
                dispatch(fetchRookieDefinitions({}));
                dispatch(fetchUserInfo({}));
            }
        }
    }, [loggedIn, shouldFetchData, accessToken, shouldRefreshData, isAdmin]);
};

export default useFetchData;
