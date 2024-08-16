import { useState } from 'react';
import nn from './login.module.css';
import InputComponent from '../input/input.component';

const LoginComponent = ({ handleSubmit, noti }) => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        fullname: '',
        password: '',
    });

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const isLogin = false;

    return (
        <form onSubmit={handleSubmit} className={nn.form}>
            {noti && <div className={nn.noti}>{noti}</div>}
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

            <button className={nn.btn}>{isLogin ? 'Update Profile' : 'Connect'}</button>
        </form>
    );
};

export default LoginComponent;
