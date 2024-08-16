/*tslint-disable*/
import React, { useState } from 'react';
import nn from './footer.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDesktopContext } from '../../screen/desktop/desktop.context';

export const FooterDesktopComponent = ({ onClicked }) => {
    const location = useLocation();
    const currentPath = location.pathname === '/' ? '/recipe' : location.pathname;

    const menu = [
        { label: 'Recipes', link: '/recipe', value: 'recipe' },
        { label: 'Favorite', link: '/favorite', value: 'favorite' },
        { label: 'Profile', link: '/profile', value: 'profile' },
    ];
    const activeStyle = {
        background: 'var(--nn-transparent)',
        color: 'var(--nn-black)',
    };

    return (
        <div className={nn.container}>
            <div className={nn.menu_bar}>
                {menu.map((item, i) => {
                    return (
                        <Link key={i} to={item.link}>
                            <div
                                style={item.link === currentPath ? activeStyle : {}}
                                className={nn.menu_item}
                                key={item.value}
                            >
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
            </div>
            {!location.pathname.startsWith('/new') && (
                <Link className={nn.menu_add} to="/new">
                    <div className={nn.add_btn}>+ Add Recipe</div>
                </Link>
            )}
        </div>
    );
};

export const FooterMobileComponent = () => {
    return <div>FooterDComponent</div>;
};
