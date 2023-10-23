import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { checkToken, setShouldRenderApp } from '../redux/slices/user.slice';
import Cookies from 'js-cookie';

const useToken = () => {
    const dispatch = useAppDispatch();

    /* Effect will execute on component mount */
    useEffect(() => {
        const refreshToken = Cookies.get('refreshToken');
        const accessToken = Cookies.get('accessToken');

        if (refreshToken) dispatch(checkToken({ token: refreshToken, refresh: true }));
        else if (accessToken) dispatch(checkToken({ token: accessToken, refresh: false }));
        else dispatch(setShouldRenderApp(true));

    }, [dispatch]);
};

export default useToken;
