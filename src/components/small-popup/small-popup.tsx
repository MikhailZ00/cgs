import * as React from 'react'
import { ReactElement, useRef, useState, useCallback } from 'react'
import { SMALL_POPUP } from 'constants/small-popup'
import { isMobile } from 'react-device-detect'
import { MainButton } from '../main-button'
import { onOuterClickHook } from 'hooks/on-outer-click'
import { apiPostEmail } from 'constants/api-methods'
import { SuccessPopup } from 'components/success-popup'
import Exit from './icons/exit.svg'

import './small-popup.scss'


interface ISmallPopupProps {
    closePopup: () => void
}

export const SmallPopup: React.FC<ISmallPopupProps> = (
{
    closePopup
}:ISmallPopupProps ):ReactElement => {


    const refInput = useRef(null);
    const popupRef = useRef(null);
    const [isSuccess, setTextSuccess] = useState(false);
	const [isError, setErrorMessage] = useState(false);

    const [isInputValid, setIsInputValid] = useState(false);
    const validEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const validTelephone = /^\+7([0-9]{10})$/;
    
    const onChangeInput = useCallback((event) => {

        if(validEmail.test(refInput.current.value) || validTelephone.test(refInput.current.value)) {
            setIsInputValid(true); 
        }
        else { setIsInputValid(false) }

    }, [isInputValid]);

	const sendEmail = useCallback((data : string) => {	
		
		setIsInputValid(false);
		
		const userRequestJson = {type : data};

		fetch(apiPostEmail, {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(userRequestJson),
			mode: 'no-cors'
		})
		.then(
			() => {
				refInput.current.value = '';
                setTextSuccess(true);
			},
			(error) => {
				setErrorMessage(true);
			}
		)	
	}, [isError, isSuccess, isInputValid]);

    onOuterClickHook(popupRef, closePopup);

    return(
        <>
            {isMobile ? 
            (
                <>
                {!isError && !isSuccess ? (
                <div className={'small-popup-mobile F-C-S'}>
                    <div onClick={() => { closePopup() }} className={'small_popup__exit-logo-mob'}><Exit /></div>
                        <div className={'small-popup-mobile__title margin-30px'}>{SMALL_POPUP.title}</div>
                        <div className={'small-popup-mobile__line'} />
                        <div className={'small-popup-mobile__text margin-30px'}>{SMALL_POPUP.text}</div>
                        <div className={'small-popup-mobile__input-text margin-30px'}>{SMALL_POPUP.aboveInputText}</div>
                        <input 
                            className={'margin-30px'}
                            type="text"
                            required
                            onChange={onChangeInput}
                            pattern={SMALL_POPUP.validationExp}
                            placeholder={SMALL_POPUP.placeholderText}
                            title={SMALL_POPUP.placeholderText}
                            ref={refInput} />
                        <div className={'margin-30px'}>
                            <MainButton 
                                title={SMALL_POPUP.buttonText}
                                isEnable={isInputValid}
                                onClickFunction={isInputValid ? () => sendEmail(refInput.current.value) : undefined} />
                        </div>
                    </div>
                    )
                    :
                    (
                        <div className='popup-success-box-mobile'>
                            {isSuccess && <div>
                                <SuccessPopup 
                                    closePopup={closePopup} 
                                    descriptionMessage={'Спасибо за обращение, мы ответим в ближайшее время!'}
                                />
                            </div>}
                            {isError && <div>
                                <SuccessPopup 
                                    closePopup={closePopup} 
                                    descriptionMessage={'Извините, произошла какая-то ошибка. Повторите попытку.'}
                                />
                            </div>}
                        </div>
                    )}
                </>
            )
            :
            (
                <>
                {!isError && !isSuccess ? (
                <div ref={popupRef} className={'small-popup F-C-SB'}>
                    <div onClick={() => { closePopup() }} className={'small_popup__exit-logo'}><Exit /></div>
                        <div className={'small-popup__title F-R-SB'}>
                            <div className={'small-popup__title-text'}>{SMALL_POPUP.title}</div>
                        </div>
                        <div className={'small-popup__content F-R-SB'}>
                            <div className={'small-popup__content-left F-C-SB'}>
                                <div className={'small-popup__text'}>{SMALL_POPUP.text}</div>
                                <img src="/images/small-popup/logo.png" width="138px" height="83px" alt=""/>
                            </div>
                            <div className={'small-popup__content-right F-C-SB'}>
                                <div className={'small-popup__input F-C-S'}>
                                    <div className={'small-popup__above-input-text'}>
                                        {SMALL_POPUP.aboveInputText}
                                    </div>
                                    <input 
                                        type="text"
                                        required
                                        onChange={onChangeInput}
                                        pattern={SMALL_POPUP.validationExp}
                                        placeholder={SMALL_POPUP.placeholderText}
                                        title={SMALL_POPUP.placeholderText}
                                        ref={refInput} />
                                </div>
                                <MainButton 
                                    title={SMALL_POPUP.buttonText}
                                    isEnable={isInputValid}
                                    onClickFunction={isInputValid ? () => sendEmail(refInput.current.value) : undefined} />
                            </div>
                        </div>
                    </div>
                    )
                    :
                    (
                        <div className='popup-success-box'>
                            {isSuccess && <div>
                                <SuccessPopup 
                                    closePopup={closePopup} 
                                    descriptionMessage={'Спасибо за обращение, мы ответим в ближайшее время!'}
                                />
                            </div>}
                            {isError && <div>
                                <SuccessPopup 
                                    closePopup={closePopup} 
                                    descriptionMessage={'Извините, произошла какая-то ошибка. Повторите попытку.'}
                                />
                            </div>}
                        </div>
                    )}
                </>
            )}
        </>
    );

}
