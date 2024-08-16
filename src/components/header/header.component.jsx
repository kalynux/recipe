/*tslint-disable*/
import React, { useState } from 'react';
import nn from './header.module.css';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { IoLogIn, IoPerson, IoPersonOutline } from 'react-icons/io5';
import PopUpComponent from '../popup/popup.component';
import LoginComponent from '../login/login.component';
import { FaArrowLeft } from 'react-icons/fa6';
import { getUserInfo, savedUserLocally, set_reci_user, supa } from '../../db/supa';
import { useDesktopContext } from '../../screen/desktop/desktop.context';
import NotiComponent from '../noti/noti.component';

export const HeaderDesktopComponent = () => {
    const context = useDesktopContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [noti, setNoti] = useState('');
    const { fullname, id: userId } = getUserInfo();
    const [showLogin, setShowLogin] = useState(false);
    let currentPath = location.pathname === '/' ? '/recipe' : location.pathname;
    const messages = {
        '/recipe': (
            <>
                Hi{' '}
                <b>
                    {fullname && fullname.includes(' ') ? fullname.split(' ')[0] : fullname || ''}
                </b>
                , what will you like to cook today?
            </>
        ),
        '/favorite': 'You did the best choice',
        '/profile': 'Manage your account',
        '/details': <BackArrow />,
        '/new': <BackArrow />,
    };

    if (!messages[currentPath]) {
        Object.keys(messages).forEach((item) => {
            if (currentPath.startsWith(item)) {
                currentPath = item;
            }
        });
    }

    const handleLogin = () => {
        if (!!userId) return navigate('/profile');
        setShowLogin(true);
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const formData = new FormData(ev.target);

        const email = formData.get('email');
        const fullname = formData.get('fullname');
        const password = formData.get('password');

        console.log(email, fullname, password);
        try {
            const register = await supa.auth.signUp({
                email,
                password,
            });

            if (register.error) {
                if (register.error.code === 'user_already_exists') {
                    const sign = await supa.auth.signInWithPassword({
                        email,
                        password,
                    });
                    console.log(sign);
                    if (sign.error) return setNoti(sign.error.message);

                    context.updateProps({ userInfo: { email, fullname } });
                    savedUserLocally({ data: sign.data, fullname });

                    return setShowLogin(false);
                }
                setNoti(register.error.message);
                return;
            }
            context.updateProps({ userInfo: { email, fullname } });
            savedUserLocally({ data: register.data, fullname });
            set_reci_user({ fullname });

            return setShowLogin(false);
        } catch (error) {
            console.error(error);
            setNoti(error.message);
        }
    };

    return (
        <div className={nn.container}>
            <div className={nn.left}>{messages[currentPath] || 'Hi,'}</div>

            {context.props?.noti?.text && (
                <NotiComponent
                    text={context.props?.noti?.text}
                    color={context.props?.noti?.color}
                />
            )}

            <div onClick={handleLogin} className={nn.right}>
                {!!userId ? <IoPerson size={22} /> : <IoLogIn size={30} />}
            </div>

            {showLogin && (
                <ConnectPopUp
                    handleClose={() => setShowLogin(false)}
                    handleSubmit={handleSubmit}
                    noti={noti}
                />
            )}
        </div>
    );
};

const ConnectPopUp = ({ handleClose, handleSubmit, noti }) => {
    return (
        <div className={nn.popup}>
            <PopUpComponent onClose={handleClose}>
                <LoginComponent handleSubmit={handleSubmit} noti={noti} />
            </PopUpComponent>
        </div>
    );
};

const BackArrow = () => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(-1)} className={nn.back_arrow}>
            <FaArrowLeft />
            Back
        </div>
    );
};

export const HeaderMobileComponent = () => {
    return <div>HeaderDComponent</div>;
};
