import * as React from 'react';
import { ReactElement, forwardRef, RefObject } from 'react';
import { isMobile } from 'react-device-detect';

import './main-button.scss';


interface IMainButtonProp {
    title: string,
    readonly isEnable: boolean,
    onClickFunction?: () => void
}

export const MainButton = forwardRef((
{
    title,
    isEnable,
    onClickFunction
}: IMainButtonProp, ref: RefObject<HTMLDivElement>): ReactElement => {

    return (
        <div ref={ref} className={!isEnable ?
            isMobile ? 'main-button-mob-disable' : 'main-button-disable'
            :
            isMobile ? 'main-button-mob' : 'main-button'} onClick={!isEnable ? undefined : onClickFunction}>
            <div className={'title-button-style'}>{title}</div>
        </div>
    );
});
