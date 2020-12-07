import * as React from 'react';
import { ReactElement } from 'react';
import './errorblock.scss';
import ErrorLogo from './icons/errorlogo.svg'
import Angle from './icons/angle.svg'
import { isMobile } from 'react-device-detect';

interface IErrorBlock {
    title: string
}

export const ErrorBlock: React.FC<IErrorBlock> = (
    {
        title
    }: IErrorBlock): ReactElement => {

    return (
        <div className="error-message-wrapper">
            <div className='error-angle'><Angle /></div>
            <div className={isMobile ? 'error-block-content-mob' : 'error-block-content'}>
                <div className='error-logo'><ErrorLogo /></div>
                <div className='error-title'>{title}</div>
            </div>
        </div>
    );
}
