import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { checkToken, setShouldRenderApp } from '../redux/slices/user.slice';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const useToken = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const refreshToken = Cookies.get('refreshToken'); // Check if the 'refreshToken' cookie exists when the component mounts
        const accessToken = Cookies.get('accessToken');

        if (refreshToken) {
            console.log('User is logged in with refresh token:', refreshToken);
            dispatch(checkToken({ token: refreshToken, refresh: true }));
        } else if (accessToken) {
            console.log('User is logged in with ACCESS token:', accessToken);
            dispatch(checkToken({ token: accessToken, refresh: false }));
        } else {
            console.log('User is not logged in.');
            dispatch(setShouldRenderApp(true));
        }
        navigate('/'); // TODO: This is a hack to force users off of specific pages on app refresh

    }, []);
};

export default useToken;
