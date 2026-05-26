import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
