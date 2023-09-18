import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { signOut, invalidateRefreshToken } from '../redux/slices/user.slice';
import { useNavigate } from 'react-router-dom';
import useLoginRedirect from '../hooks/useLoginRedirect';
import Cookies from 'js-cookie';
import { setExposureType } from '../redux/slices/exposure.slice';

export default function SignOut() {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useLoginRedirect();

    useEffect(() => {
        const refreshToken = Cookies.get('refreshToken')
        if (refreshToken) {
            dispatch(invalidateRefreshToken(refreshToken));
        }
        dispatch(signOut());
        dispatch(setExposureType(''));
    }, [dispatch]);

    return (<></>);

}