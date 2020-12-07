import * as React from 'react';
import { ReactElement } from 'react';
import { isMobile } from 'react-device-detect';
import './select-address.scss';
import Mark from './icons/mark.svg'

interface ISelectAddressProp {
    title: string
    
}

export const SelectAddress: React.FC<ISelectAddressProp> = (
{
    title
}: ISelectAddressProp): ReactElement => {

    return (
        <div>
            <div className={isMobile ? 'select-address-box-mob' : 'select-address-box'}>
                <div className='logo-address'><Mark /></div>
                <div className='title-address-text'>{title}</div>
            </div>
        </div>
    );
}
