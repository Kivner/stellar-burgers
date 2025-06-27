import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          className={({ isActive }) =>
            clsx(styles.link, isActive && styles.link_active)
          }
          to={`/`}
        >
          <BurgerIcon type={'primary'} />
          <Link
            to='/'
            className={
              location.pathname === '/' ? styles.link_active : styles.link
            }
          />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            clsx(styles.link, isActive && styles.link_active)
          }
          to={'/feed'}
        >
          <ListIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </NavLink>
      </div>
      <NavLink to={`/`} className={styles.logo}>
        <Logo className='' />
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          clsx(
            styles.link,
            styles.link_position_last,
            isActive && styles.link_active
          )
        }
        to={userName ? '/profile' : '/login'}
      >
        <div className={styles.link_position_last}>
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </NavLink>
    </nav>
  </header>
);
