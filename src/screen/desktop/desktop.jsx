import React from 'react';
import { FooterDesktopComponent } from '../../components/footer/footer.component';
import { HeaderDesktopComponent } from '../../components/header/header.component';
import { Outlet, useNavigate } from 'react-router-dom';
import { DesktopProvider } from './desktop.context';

const Desktop = () => {
    return (
        <DesktopProvider>
            <HeaderDesktopComponent />
            <div
                style={{
                    padding: '20px',
                    height: 'calc(100vh - 8rem)',
                    background: 'var(--nn-secondary)',
                    margin: '0 2rem',
                    border: '2px solid var(--nn-grey)',
                    borderRadius: '20px 20px 10px 10px',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    scrollbarColor: 'transparent transparent',
                    WebkitMaskImage:
                        '-webkit-linear-gradient(to bottom, transparent, var(--nn-grey))',
                    boxSizing: 'border-box',
                }}
            >
                <Outlet />
            </div>
            <FooterDesktopComponent />
        </DesktopProvider>
    );
};

export default Desktop;
