import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../services/hooks';
import { logoutUser } from '../../services/slices/userSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login'); //редирект после выхода
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
