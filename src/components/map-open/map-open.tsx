import * as React from 'react';
import { ReactElement } from 'react';
import Mark from './icons/mark.svg'

import './map-open.scss';
import { isMobile } from 'react-device-detect';


interface IMapOpenProp {
    title: string,
    onClick: () => void
}

export const MapOpen: React.FC<IMapOpenProp>  = (
{ 
    title,
    onClick
}: IMapOpenProp):ReactElement => {

return (
    <div className={isMobile ? 'map-open-mobile' : 'map-open'} onClick={onClick}>
        <Mark />
        <div className={'map-open-text'}>{title}</div>
    </div>
);
}
