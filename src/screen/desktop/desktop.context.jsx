import React, { createContext, useContext, useState } from 'react';

const DesktopContext = createContext();

export const useDesktopContext = () => {
    return useContext(DesktopContext);
};

export const DesktopProvider = ({ children }) => {
    const [props, setProps] = useState({});
    const updateProps = (newProps) => {
        if (typeof newProps !== 'object')
            throw new Error(
                `Expected an Object [instead of ${typeof newProps}]. Check the props passed into the updateProps method of the DesktopContext`
            );
        setProps((prevProps) => {
            return { ...prevProps, ...newProps };
        });
    };
    return (
        <DesktopContext.Provider value={{ props, updateProps }}>{children}</DesktopContext.Provider>
    );
};
