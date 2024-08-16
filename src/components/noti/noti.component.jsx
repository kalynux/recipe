import React from 'react';
import nn from './noti.module.css';

const NotiComponent = ({ text, color }) => {
    return (
        <div style={{ background: color }} className={nn.noti}>
            {text}
        </div>
    );
};

export default NotiComponent;
