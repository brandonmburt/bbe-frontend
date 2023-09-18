import { useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { selectLoggedIn } from '../redux/slices/user.slice';

const useLoginRedirect = () => {
  const loggedIn = useAppSelector(selectLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate('/signIn');
    }
  }, [loggedIn, navigate]);
};

export default useLoginRedirect;
