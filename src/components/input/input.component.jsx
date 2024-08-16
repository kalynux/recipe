import React, { useState } from 'react';
import nn from './input.module.css';

const InputComponent = ({
    type,
    placeholder,
    value,
    onChange,
    id,
    name,
    componentStyle,
    multiple,
    fileType,
}) => {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <input
            name={name}
            id={id}
            style={{ borderColor: isFocus ? 'var(--nn-blue)' : '', ...componentStyle }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            className={nn.input}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            multiple={multiple}
            accept={fileType}
        />
    );
};

export default InputComponent;
