import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { Logo } from '@zlden/react-developer-burger-ui-components';

// Расширяем пропсы: добавляем React-элементы для ссылок
type TAppHeaderUIExtendedProps = TAppHeaderUIProps & {
  linkConstructor?: React.ReactNode;
  linkFeed?: React.ReactNode;
  linkProfile?: React.ReactNode;
};

export const AppHeaderUI: FC<TAppHeaderUIExtendedProps> = ({
  userName,
  linkConstructor,
  linkFeed,
  linkProfile
}) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        {linkConstructor}
        {linkFeed}
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <div className={styles.link_position_last}>{linkProfile}</div>
    </nav>
  </header>
);
