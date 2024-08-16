import { useState } from 'react';
import nn from './connect.module.css';
import LoginComponent from '../../components/login/login.component';
import { savedUserLocally, supa, set_reci_user } from '../../db/supa';
import { useNavigate } from 'react-router-dom';
import { useDesktopContext } from '../../screen/desktop/desktop.context';

const ConnectPage = () => {
    const context = useDesktopContext();
    const navigate = useNavigate();
    const [noti, setNoti] = useState('');

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        const formData = new FormData(ev.target);

        const email = formData.get('email');
        const fullname = formData.get('fullname');
        const password = formData.get('password');
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

                    if (sign.error) return setNoti(sign.error.message);

                    context.updateProps({ userInfo: { email, fullname } });
                    savedUserLocally({ data: sign.data, fullname });

                    return navigate('/recipe');
                }
                setNoti(register.error.message);
                return;
            }
            context.updateProps({ userInfo: { email, fullname } });
            savedUserLocally({ data: register.data, fullname });
            set_reci_user({ fullname });

            return navigate('/recipe');
        } catch (error) {
            console.error(error);
            setNoti(error.message);
        }
    };

    return (
        <div className={nn.container}>
            <div className={nn.wrapper}>
                <h3>Connect to RECIPO</h3>
                <LoginComponent handleSubmit={handleSubmit} noti={noti} />
            </div>
        </div>
    );
};

export default ConnectPage;
