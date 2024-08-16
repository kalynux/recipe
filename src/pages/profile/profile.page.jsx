import { useState } from 'react';
import nn from './profile.module.css';
import InputComponent from '../../components/input/input.component';
import { useDesktopContext } from '../../screen/desktop/desktop.context';
import { getUserInfo, saveUser } from '../../db/supa';

const ProfilePage = () => {
    const context = useDesktopContext();
    const { email, fullname } = getUserInfo();
    const [userInfo, setUserInfo] = useState({
        email: email || '',
        fullname: fullname || '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = async (ev) => {
        setLoading(true);
        ev.preventDefault();
        const formData = new FormData(ev.target);

        const email = formData.get('email');
        const fullname = formData.get('fullname');
        const password = formData.get('password');

        const updateUser = await saveUser({ email, fullname, password });
        if (updateUser?.error) {
            context.updateProps({ noti: { text: updateUser.error, color: 'pink' } });
        } else {
            context.updateProps({ noti: { text: 'Account updated successfully', color: 'lightblue' } });
        }

        setTimeout(() => {
            context.updateProps({ noti: { text: null } });
        }, 5000);
        setLoading(false);
    };

    return (
        <div className={nn.container}>
            <form onSubmit={handleSubmit} className={nn.form}>
                <div className={nn.input_container}>
                    <label htmlFor="email">Fullname</label>
                    <InputComponent
                        id={'fullname'}
                        name={'fullname'}
                        value={userInfo.fullname || ''}
                        onChange={handleChange}
                        placeholder={'Enter fullname'}
                    />
                </div>
                <div className={nn.input_container}>
                    <label htmlFor="email">Email address</label>
                    <InputComponent
                        id={'email'}
                        name={'email'}
                        value={userInfo.email || ''}
                        onChange={handleChange}
                        placeholder={'Enter email address'}
                    />
                </div>
                <div className={nn.input_container}>
                    <label htmlFor="pass">Password</label>
                    <InputComponent
                        id={'pass'}
                        name={'password'}
                        value={userInfo.password || ''}
                        onChange={handleChange}
                        placeholder={'Change Password'}
                    />
                </div>

                <button className={loading ? nn.loading_btn : nn.btn}>
                    {' '}
                    {loading ? 'Updating...' : 'Update Profile'}{' '}
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
