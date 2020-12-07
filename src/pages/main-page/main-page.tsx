import * as React from "react";
import { ReactElement, useState, useCallback, useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { apiGetFields, apiPostCalculateRequest } from 'constants/api-methods';
import { DatepickerCustom } from 'components/datepicker-custom';
import { Popup } from 'components/popup';
import { DropdownList } from 'components/dropdown-list';
import { disableScroll, enableScroll } from 'core/scroll';
import addDays from 'date-fns/addDays';
import { BlockMap } from 'components/block-map';
import { YMaps } from 'react-yandex-maps';
import { BlockTypes } from 'components/block-types';
import { BlockSrcTowns } from 'components/block-src-towns';
import { BlockServices } from 'components/block-services';
import { dateToString, getCurrentCityCoords } from 'utils/main-page';
import { MainButton } from 'components/main-button';
import { SmallPopup } from 'components/small-popup';
import { getToLocalStorage } from 'core/helper-localstore';
import { onOuterClickHook } from 'hooks/on-outer-click';
import { scrollErrorElement } from 'core/scroll-to-element';
import { ErrorBlock } from 'components/errorblock';
import { Footer } from 'components/footer'
import Phone from './icons/phone.svg'

import './main-page.scss';


export const MainPage = (): ReactElement => {
    // State для запроса
    const [selectedSrcCity, setScrCity] = useState<string>('');
    const [selectedDestCity, setDestCity] = useState<number>(-1);
    const [selectedVanType, setVanType] = useState<string>('');
    const [selectedDate, setDate] = useState<Date>(isMobile ? null : addDays(new Date(), 1));
    const [selectedWarehousePost, setWarehousePost] = useState<string>('');
    const [selectedСargoId, setСargoId] = useState<number>(-1);
    const [selectedAdditionalFields, setAddFields] = useState<ISelectedAdditionalFields>({});

    const popupRef = useRef(null);

    // Внутренний state main-page
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [postResponse, setPostResponse] = useState<IPostResponse>({
        price: 0,
        status: -1,
        'status_description': ''
    });
    const [isButtonEnable, setIsButtonEnable] = useState(false);
    const [isPostCalculate, setIsPostCalculate] = useState(false);
    const [isErrorDropped, setErrorDropped] = useState(true);
    const [inputValue, setInputValueAdd] = useState<string>('');
    const [isButtonClicked, setButtonClicked] = useState(false);
    const [contentForRender, setContentForRender] = useState<IBackResponse>({})
    const [isError, useError] = useState(false);
    const [cargoValue, setCargoValue] = useState<string>('');

    const handleOnPopupClose = useCallback(() => {
        setIsPopupOpen(false);
        if (isMobile) {
            enableScroll();
        }
        setIsButtonEnable(true);
    }, [setIsPopupOpen]);

    const handleOnPopupOpen = useCallback(() => {
        setIsPopupOpen(true);
        if (isMobile) {
            disableScroll(popupRef);
        }
    }, [setIsPopupOpen]);

    const setInputValue = useCallback((state: string) => {
        setInputValueAdd(state);
    }, [inputValue, setInputValueAdd]);

    const buttonClickedCB = useCallback(() => {
        setButtonClicked(true);
    }, [setButtonClicked])

    useEffect(() => {
        if (isButtonClicked) {
            scrollErrorElement('error-message-wrapper');
        }
    }, [isButtonClicked])

    useEffect(() => {
        fetch(apiGetFields)
            .then(response => response.json())
            .then(response => {
                setContentForRender(response);
            })
            .catch(error => useError(true))
    }, []);

    const setDateCB = useCallback((date: Date) => {
        setDate(date);
    }, [selectedDate]);

    const setCargoIdCB = useCallback((num: number) => {
        setСargoId(num);
    }, [selectedСargoId]);

    const setDestCityCB = useCallback((city: number) => {
        setDestCity(city);
    }, [selectedСargoId]);

    const setScrCityCB = useCallback((city: string) =>
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            setScrCity(city);
    }, [selectedSrcCity]);
        
    const setVanTypeCB = useCallback((type: string) =>
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            setVanType(type);
    }, [selectedVanType]);
        
    const setWarehousePostCB = useCallback((adress: string) => {
        setWarehousePost(adress);
    }, [selectedWarehousePost]);

    const setAddFieldByNameCB = useCallback((name: string, value: boolean): void => {
        setAddFields({...selectedAdditionalFields, [name]: value});        
    }, [selectedAdditionalFields, setAddFields]);

    const setErrorDroppedCB = useCallback(() => {
        setErrorDropped(false);
    }, [setErrorDropped, isErrorDropped]);

    useEffect(() => {
        if (
            selectedDate &&
            selectedSrcCity &&
            selectedVanType &&
            selectedWarehousePost &&
            selectedСargoId !== -1 &&
            contentForRender &&
            selectedDestCity !== -1 &&
            isPostCalculate === false
        ) { setIsButtonEnable(true); }
    });

    const sendCalculateRequestCB = useCallback(() => {

        setIsButtonEnable(false);
        setIsPostCalculate(true);

        if (
            selectedDate &&
            selectedSrcCity &&
            selectedVanType &&
            selectedWarehousePost &&
            selectedСargoId !== -1 &&
            contentForRender &&
            selectedDestCity !== -1
        ) {

            for(let i = 0; i < contentForRender.additional_fields.length; i++)
            {
                if(!selectedAdditionalFields[contentForRender.additional_fields[i].name]) {
                    setAddFieldByNameCB(contentForRender.additional_fields[i].name, false);
                }   
            }

            const postBody: IPostBody = {
                src_city: contentForRender.src_city.filter((city) => city.name === selectedSrcCity)[0].id,
                cargo_type: selectedСargoId,
                dest_city: selectedDestCity,
                src_addr: selectedWarehousePost,
                date: dateToString(selectedDate),
                container_type: contentForRender.container_type.filter((city) => city.name === selectedVanType)[0].id,
                goods_price: Number(inputValue),
                additional_fields: selectedAdditionalFields
            }
            
            fetch(apiPostCalculateRequest, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(postBody)
            })
                .then(response => response.json())
                .then(response => {

                    if (response.status_description === 'ok') {
                        setPostResponse(response);
                        handleOnPopupOpen();
                    }
                    else {
                        alert(response.status_description);
                    }

                    setIsPostCalculate(false);

                });

        }

    }, [
        contentForRender,
        selectedSrcCity,
        selectedDate,
        selectedWarehousePost,
        selectedСargoId,
        inputValue,
        selectedAdditionalFields,
        selectedVanType,
        selectedDestCity,
        isButtonEnable
    ]);

    const mainButtonRef = useRef(null);

    onOuterClickHook(mainButtonRef, () => {
        setButtonClicked(false);
    });

    const phone = '+7 (499) 390-52 45';

    return (
        <div className={isMobile ? 'main-app-mob' : 'main-app'}>
            <div className='main-page'>
                <div className={isMobile ? '' : 'main-content'}>
                    <div className={isMobile ? 'main-header-mob' : 'main-header'}>
                        <div className={isMobile ? 'main-logo-mob' : 'main-logo'}>
                            <img src="/images/main-page/logo.png" width={146} height={93} alt="" />
                        </div>
                        <div className={'main-phone-block'}>
                            <div className={'main-phone-icon'}>
                                <Phone />
                            </div>
                            <div className={'main-phone'}>{phone}</div>
                        </div>
                    </div>
                    <div className={isMobile ? '' : 'main-header-box'}>
                        <div className={isMobile ? '' : 'main-text-position'}>
                            <div className={isMobile ? 'main-text-mob' : 'main-text'}>
                                Расчет стоимости контейнерной < br /> перевозки
                            </div>
                        </div>
                    </div>
                    {isError ? (
                        <div className={'main-text-position'}>
                            <div className={isMobile ? 'main-text-mob' : 'main-text'}>Ошибка загрузки данных!</div>
                        </div>
                        )
                        :
                        (
                            <div>                                
                                <div className={isMobile ? 'main-page-content-wrapper' : ''}>
                                    <div>
                                        <div className={isMobile ? 'main-page-content-mobile' : 'main-page-content'}>
                                            <div className={'main-page-left-part'}>
                                                {isMobile &&
                                                    <div className={'main-page-right-part'}>
                                                        <div className={isMobile ? 'text-before-checkbox-mob' : 'text-before-checkbox'}>
                                                            Дата отправления *
                                                        </div>
                                                        <DatepickerCustom
                                                            setDate={setDateCB}
                                                            selectedDate={selectedDate}
                                                        />
                                                        {isButtonClicked && !selectedDate &&
                                                            <div className={'error-date-mob'}>
                                                                <ErrorBlock title={'Выберите дату отправления'} />
                                                            </div>
                                                        }
                                                    </div>}
                                                <BlockSrcTowns
                                                    setScrCityCB={setScrCityCB}
                                                    cityChecked={selectedSrcCity}
                                                    srcCity={contentForRender.src_city} />
                                                {isButtonClicked && !selectedSrcCity &&
                                                    <div className={'error-src-city'}>
                                                        <ErrorBlock title={'Выберите город отправления'} />
                                                    </div>
                                                }
                                                <BlockTypes
                                                    setVanTypeCB={setVanTypeCB}
                                                    vanTypeChecked={selectedVanType}
                                                    containerType={contentForRender.container_type} />
                                                {isButtonClicked && !selectedVanType &&
                                                    <div className={isMobile ? 'error-van-type-mob' : 'error-van-type'}>
                                                        <ErrorBlock title={'Выберите тип размер контейнера'} />
                                                    </div>
                                                }
                                                <div onClick={setErrorDroppedCB} className={isMobile ? 'choose-cargo-mob' : 'choose-cargo'}>
                                                    <div className={isMobile ? 'text-before-checkbox-mob' : 'text-before-checkbox'}>
                                                        Груз по ЕТСНГ *
                                                </div>
                                                    <DropdownList
                                                        setId={setCargoIdCB}
                                                        setValue={setCargoValue}
                                                        isAddress={false}
                                                        cargoTypes={contentForRender.cargo_type} />

                                                </div>
                                                {isButtonClicked && selectedСargoId == -1 && isErrorDropped &&
                                                    <div className={isMobile ? 'error-cargo-type-mob' : 'error-cargo-type'}>
                                                        <ErrorBlock title={'Выберите тип груза по ЕТСНГ'} />
                                                    </div>
                                                }
                                            </div>
                                            {!isMobile &&
                                                <div className={'main-page-right-part'}>
                                                    <div className={isMobile ? 'text-before-checkbox-mob' : 'text-before-checkbox'}>
                                                        Дата отправления *
                                                    </div>
                                                    <DatepickerCustom
                                                        setDate={setDateCB}
                                                        selectedDate={selectedDate}
                                                    />
                                                    {isButtonClicked && isMobile && dateToString(selectedDate) == dateToString(addDays(new Date(), 1)) &&
                                                        <div className={'error-date'}><ErrorBlock title={'Выберите дату отправления'} /></div>
                                                    }
                                                </div>}
                                        </div>
                                        <div className={'main-page-bottom-part'}>
                                            {isButtonClicked && !selectedWarehousePost &&
                                                <div className={isMobile ? 'error-post-mob' : 'error-post'}>
                                                    <ErrorBlock title={'Вы ввели некорректный адрес'} />
                                                </div>
                                            }
                                            <YMaps 
                                                query={{ apikey: 'a59542ef-5c9a-4e1e-95a0-8ceb2d855f9c' }} >
                                                <BlockMap
                                                    title={'Адрес склада погрузки *'}
                                                    setAdress={setWarehousePostCB}
                                                    adress={selectedWarehousePost}
                                                    id={'input_post'}
                                                    srcCityCoords={getCurrentCityCoords(contentForRender, selectedSrcCity)}
                                                    />
                                                <div className={isMobile ? 'block-map-mobile' : 'block-map'}>
                                                    <div className={isMobile ? 'text-before-checkbox-mob' : 'text-before-checkbox'}>
                                                        Адрес склада выгрузки *
                                                    </div>
                                                    <div style={isMobile ? {} : { width: '744px' }}>
                                                        <DropdownList
                                                            setId={setDestCityCB}
                                                            setValue={() => {}}
                                                            isAddress={true}
                                                            cargoTypes={contentForRender.dest_city} />
                                                    </div>
                                                    {isButtonClicked && selectedDestCity === -1 &&
                                                        <div className={isMobile ? 'error-dest-city-mob' : 'error-dest-city'}>
                                                            <ErrorBlock title={'Вы ввели некорректный адрес'} />
                                                        </div>
                                                    }
                                                    {isButtonClicked && selectedAdditionalFields['Страхование груза'] && !inputValue &&
                                                        <div className={isMobile ? 'error-input-addfield-mob' : 'error-input-addfield'}>
                                                            <ErrorBlock title={'Введите стоимость груза'} />
                                                        </div>
                                                    }
                                                </div>

                                            </YMaps>
                                        </div>
                                        <BlockServices
                                            additionalFieldsArr={contentForRender.additional_fields}
                                            additionalFields={selectedAdditionalFields}
                                            setAddFieldByNameCB={setAddFieldByNameCB}
                                            setInputVal={setInputValue}
                                        />
                                        <div onClick={buttonClickedCB} className={isMobile ? '' : 'post-btn'}>
                                            <MainButton
                                                title={'Показать расчетную стоимость'}
                                                isEnable={true}
                                                onClickFunction={sendCalculateRequestCB} 
                                                ref={mainButtonRef}
                                            />
                                        </div>
                                        <Footer />
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
            {isPopupOpen && (
                getToLocalStorage() === 'small-popup-style' ? (
                    <div ref={popupRef} className={isMobile ? '' : 'small-popup-style'}>
                        <SmallPopup
                            closePopup={handleOnPopupClose} />
                    </div>
                )
                :
                (
                    <div className={isMobile ? '' : 'popup-style'}>
                        <YMaps query={{ apikey: 'a59542ef-5c9a-4e1e-95a0-8ceb2d855f9c' }}>
                            <Popup
                                closePopup={handleOnPopupClose}
                                price={inputValue}
                                postResponse={postResponse}
                                srcAddress={selectedWarehousePost}
                                town={selectedSrcCity}
                                vanType={selectedVanType}
                                date={selectedDate}
                                cargo={selectedСargoId + ' ' + cargoValue}
                                destAdress={contentForRender.dest_city[selectedDestCity].name}
                                additionalFields={selectedAdditionalFields}
                            />
                        </YMaps>
                    </div>
                )
            )}
        </div>
    )
}
