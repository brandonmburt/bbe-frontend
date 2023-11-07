import { useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { selectUserIsAdmin } from '../redux/slices/user.slice';

const useAdminRedirect = () => {
  const isAdmin: boolean = useAppSelector(selectUserIsAdmin);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
};

export default useAdminRedirect;
