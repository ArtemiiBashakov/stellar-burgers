import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';
import { selectUser } from '../../services/slices/userSlice';
import { AppHeaderUI } from '@ui';
import {
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from '../ui/app-header/app-header.module.css';

export const AppHeader: FC = () => {
  const user = useAppSelector(selectUser);

  const linkConstructor = (
    <NavLink
      to='/'
      className={({ isActive }) =>
        `${styles.link} ${isActive ? styles.link_active : ''}`
      }
    >
      {({ isActive }) => (
        <>
          <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </>
      )}
    </NavLink>
  );

  const linkFeed = (
    <NavLink
      to='/feed'
      className={({ isActive }) =>
        `${styles.link} ${isActive ? styles.link_active : ''}`
      }
    >
      {({ isActive }) => (
        <>
          <ListIcon type={isActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </>
      )}
    </NavLink>
  );

  const linkProfile = (
    <NavLink
      to='/profile'
      className={({ isActive }) =>
        `${styles.link} ${isActive ? styles.link_active : ''}`
      }
    >
      {({ isActive }) => (
        <>
          <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>
            {user?.name || 'Личный кабинет'}
          </p>
        </>
      )}
    </NavLink>
  );

  return (
    <AppHeaderUI
      userName={user?.name}
      linkConstructor={linkConstructor}
      linkFeed={linkFeed}
      linkProfile={linkProfile}
    />
  );
};
