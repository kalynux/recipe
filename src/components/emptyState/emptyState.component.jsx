import React from 'react';
import nn from './emptyState.module.css';
import { empty_recipe } from '../../assets';

const EmptyStateComponent = ({ text = 'No Item Found' }) => {
    return (
        <div className={nn.container}>
            <img className={nn.image} src={empty_recipe} alt="no_found" />
            <p className={nn.text}>{text}</p>
        </div>
    );
};

export default EmptyStateComponent;
