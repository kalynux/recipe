import React, { useEffect, useRef } from 'react';
import nn from './popup.module.css';
import OutsideClickHandler from 'react-outside-click-handler';
import { IoClose } from 'react-icons/io5';

const PopUpComponent = ({ children, onClose, Style }) => {
    return (
        <div className={nn.container}>
            <OutsideClickHandler onOutsideClick={onClose}>
                <div style={{ ...Style }} className={nn.pop_container}>
                    <IoClose size={20} className={nn.close_icon} onClick={onClose} />
                    <div onClick={onClose} className={nn.decorator}></div>
                    <div className={nn.content}>{children}</div>
                </div>
            </OutsideClickHandler>
        </div>
    );
};

export default PopUpComponent;
