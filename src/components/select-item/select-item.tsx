import * as React from 'react';
import { ReactElement } from 'react';
import { isMobile } from 'react-device-detect';
import './select-item.scss';

interface ISelectItemProp {
    number: string,
    title: string
    
}

export const SelectItem: React.FC<ISelectItemProp> = (
    {
        number,
        title
    }: ISelectItemProp): ReactElement => {

    return (
        <div>
            { number.substr(1, 3).includes('000') ?
            <div className={isMobile ? 'select-item-box-mob' : 'select-item-box'}>
                <div className='only-title-item-text'>{title}</div>
            </div>
            :
            <div className={isMobile ? 'select-item-box-mob' : 'select-item-box'}>
                <div className='id-item-text'>{'#' + number}</div>
                <div className='title-item-text'>{title}</div>
            </div>
            }
        </div>
    );
}
