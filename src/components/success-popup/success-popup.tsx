import * as React from 'react'
import { ReactElement, useRef } from 'react'
import { isMobile } from 'react-device-detect'
import { onOuterClickHook } from 'hooks/on-outer-click'
import Logo from './icons/logo.svg'

import './success-popup.scss'

interface ISuccessPopupProps {
    descriptionMessage: string,
    closePopup: () => void
}

export const SuccessPopup: React.FC<ISuccessPopupProps> = (
{
    descriptionMessage,
    closePopup
}:ISuccessPopupProps ): ReactElement => {
    const popupRef = useRef(null);

    onOuterClickHook(popupRef, closePopup);
    return(
        <div ref={popupRef} className={!isMobile ? 'success-popup-background' : 'success-popup-background-mobile'}>
            <div className={isMobile ? 'success-popup-block-mobile' : 'success-popup-block'}>
                <div className={isMobile ? 'success-popup-title-mobile' : 'success-popup-title'}>
                    {descriptionMessage}
                </div>
                <div className={isMobile ? 'success-popup-icon-mobile' : 'success-popup-icon'}>
                    <Logo/>
                </div>
            </div>
        </div>
    );
}
