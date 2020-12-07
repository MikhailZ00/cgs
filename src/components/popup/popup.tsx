import * as React from 'react';
import { isMobile } from 'react-device-detect';
import {
	useState,
	ReactElement,
	useCallback,
	useRef
} from 'react';
import Whatsapp from './icons/whatsapp.svg'
import Telegram from './icons/telegram.svg'
import Viber from './icons/viber.svg'
import Sms from './icons/sms.svg'
import Tel from './icons/tel.svg'
import Email from './icons/email.svg'
import Exit from './icons/exit.svg'
import MaskedInput from 'react-text-mask'
import { Bind } from 'constants/binds'
import { MainButton } from 'components/main-button'
import { onOuterClickHook } from 'hooks/on-outer-click'
import { apiPostEmail } from 'constants/api-methods'
import { SuccessPopup } from 'components/success-popup'
import { GetDistances } from 'hooks/getDistances';
import { formEmailBody } from 'core/form-email-body';
import { objectToString } from 'utils/popup'
import { POPUP_TEXT } from 'constants/popup'

import './popup.scss';


interface IPopupProp {
	closePopup: () => void,
	price: string,
	postResponse: any,
	srcAddress: string
	town: string,
	vanType: string,
	date: Date,
	cargo: string,
	destAdress: string,
	additionalFields: ISelectedAdditionalFields
}

export const Popup: React.FC<IPopupProp> = (
{
	closePopup,
	price,
	postResponse,
	srcAddress,
	town,
	vanType,
	date,
	cargo,
	destAdress,
	additionalFields
}: IPopupProp): ReactElement => {

	const popupRef = useRef(null);
	const inputRef = useRef(null);

	const [inputValue, setInputValue] = useState('');
	const [isSuccess, setTextSuccess] = useState(false);
	const [isButtonActive, setButton] = useState(false);
	const [isError, setErrorMessage] = useState(false);
	const [resultSumsState, setResultSumsState] = useState([]);
	const [connectionType, setConnectionType] = useState(Bind.NOTHING);

	const validEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	const validTelephone = /^\+7[ ]\(?([0-9]{3})\)[ ]([0-9]{3})[-]([0-9]{2})[-]([0-9]{2})$/;

	onOuterClickHook(popupRef, closePopup);

	const sendEmail = useCallback((data: string, type: Bind) => {

		setButton(false);

		const userRequestJson = [
			{name: 'Способ связи', value: type},
			{name: 'Данные', value: data},
			{name: 'Город отправления', value: town},
			{name: 'Тип размера контейнера', value: vanType},
			{name: 'Дата отправления', value: date.toDateString()},
			{name: 'Груз по ЕТСНГ', value: cargo},
			{name: 'Адрес склада погрузки', value: srcAddress},
			{name: 'Адрес склада выгрузки', value: destAdress},
			{name: 'Дополнительно', value: objectToString(additionalFields) || '-'},
			{name: 'Стоимость груза для страхования (если включено)', value: price || '-'},
			{name: 'Стоимость по компаниям', value: resultSumsState.map((price) => `${price.company} - ${price.sum}`).join(', ')}
		];

		fetch(apiPostEmail, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(formEmailBody(userRequestJson)),
			mode: 'no-cors'
		})
			.then(
				() => {
					setInputValue('');
					setTextSuccess(true);
					setConnectionType(Bind.NOTHING);
				},
				() => {
					setErrorMessage(true);
				}
			)
	}, [inputValue, isError, connectionType, isSuccess, isButtonActive]);

	const setSelStartEnd = (numb: number) => {
		inputRef.current.inputElement.selectionStart = numb;
		inputRef.current.inputElement.selectionEnd = numb;
	}

	const onClickInput = useCallback((event) => {

		if (event.target.value === '+7 (xxx) xxx-xx-xx' || event.target.value === '') {
			inputRef.current.inputElement.value = '+7 (xxx) xxx-xx-xx'
			inputRef.current.inputElement.selectionStart = 4;
			inputRef.current.inputElement.selectionEnd = 4;
		}
		else {
			const input = event.target.value.match(/\d{1}/g);
			if (input.length >= 0 && input.length < 4) {
				setSelStartEnd(input.length + 3);
			}
			else if (input.length >= 4 && input.length <= 6) {
				setSelStartEnd(input.length + 5);
			}
			else if (input.length >= 7 && input.length < 9) {
				setSelStartEnd(input.length + 6);
			}
			else if (input.length >= 9 && input.length < 11) {
				setSelStartEnd(input.length + 7);
			}
		}
	}, [inputValue]);

	const onChangeTypeCB = useCallback((type) => {
		if (validTelephone.test(inputValue))
			setButton(true);
		else
			setButton(false);
		setConnectionType(type)
	}, [setButton, setConnectionType, inputValue])

	const handleChange = useCallback((event) => {
		setInputValue(event.target.value);
		if(
			(validTelephone.test(event.target.value) || 
			(validEmail.test(event.target.value) && connectionType === Bind.EMAIL))
		) {setButton(true); }
		else { setButton(false); };
	}, [inputValue, connectionType, isButtonActive]);


	return (
		<GetDistances pricesArr={postResponse.prices} address={srcAddress}>
			{(resultSums) => {
				setResultSumsState(resultSums.prices);
				return (
					resultSums !== 'load' ?
						(!isError && !isSuccess) ?
							<div ref={popupRef} className={isMobile ? 'popup-box-mob' : 'popup-box'}>
								<div onClick={() => { closePopup() }} className={'exit-logo'}>
									<Exit />
								</div>
								<div className={'popup-title'}>
									Примерная стоимость{isMobile ? <br /> : ' '}перевозки
								</div>
								<div className={isMobile ? '' : 'two-blocks-of-elements'}>
									<div className={'block-of-left-elements'}>
										{resultSums.prices.map((prices, index) => (
											<div 
												key={index}
												className={'popup-prices-blok'} >
												<div className={'transportation-via-text'}>
													{POPUP_TEXT.transportation_via}
												</div>
												<div className={'prices-block-content'}>
													<div><img src={prices.img} alt={prices.company} /></div>													
													<div className={'prices-wrap'}>
														{isMobile && <div className='line-vertical'/>}
														<div className={'prices'}>
															<div className={'price-railways'}>
																<div>{isMobile ? 
																	POPUP_TEXT.price_title_text_mob :
																	POPUP_TEXT.price_title_text}</div>
																<div className={'price'}>
																	{parseInt(prices.price_station_to_station).toLocaleString() + ' ₽'}
																</div>
															</div>
															<div className={'additional-prices'}>
																<div>{isMobile ? 
																	POPUP_TEXT.store_to_station_mob : 
																	POPUP_TEXT.store_to_station}</div>
																<div className={'price'}>
																	{parseInt(prices.price_store_to_station).toLocaleString() + ' ₽'}
																</div>
															</div>
															<div className={'additional-prices'}>
																<div>{isMobile ? 
																	POPUP_TEXT.station_to_store_mob : 
																	POPUP_TEXT.station_to_store}</div>
																<div className={'price'}>
																	{parseInt(prices.price_station_to_store).toLocaleString() + ' ₽'}
																</div>
															</div>
															<div className={'additional-prices'}>
																<div>{isMobile ? 
																	POPUP_TEXT.price_services_mob : 
																	POPUP_TEXT.price_services}</div>
																<div className={'price'}>
																{parseInt(prices.price_services).toLocaleString() + ' ₽'}
																</div>
															</div>
															<div className={'price-sum'}>
																<div>{isMobile ? 
																	POPUP_TEXT.sum_mob : 
																	POPUP_TEXT.sum}</div>
																<div className={'price'}>
																	{parseInt(prices.sum).toLocaleString() + ' ₽'}
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
									<div className={'block-of-right-elements'}>
										<div className={'description-price'}>
											{isMobile ? POPUP_TEXT.details_mob : POPUP_TEXT.details}
										</div>
										<div className={'popup-description'}>
											{POPUP_TEXT.way_get_details}
										</div>
										<div className={isMobile ? 'popup-description-content' : 'box-of-buttons'}>
											<div className='box-of-buttons-column'>
												<div onClick={() => onChangeTypeCB(Bind.WHATSAPP)}
													className={connectionType === Bind.WHATSAPP ?
														'button-selected' : 'button-not-selected'}>
													<div className={'icon-button'}>
														<Whatsapp />
														<div className={'text-button'}>WhatsApp</div>
													</div>
												</div>
												<div onClick={() => onChangeTypeCB(Bind.TELEGRAM)}
													className={connectionType === Bind.TELEGRAM ?
														'button-selected' : 'button-not-selected'}>
													<div className={'icon-button'}>
														<Telegram />
														<div className={'text-button'}>Telegram</div>
													</div>
												</div>
												<div onClick={() => onChangeTypeCB(Bind.VIBER)}
													className={connectionType === Bind.VIBER ?
														'button-selected' : 'button-not-selected'}>
													<div className={'icon-button'}>
														<Viber />
														<div className={'text-button'}>Viber</div>
													</div>
												</div>
											</div>
											<div className='box-of-buttons-column'>
												<div onClick={() => onChangeTypeCB(Bind.SMS)}
													className={connectionType === Bind.SMS ?
														'button-selected' : 'button-not-selected'}>
													<div className={'icon-button'}>
														<Sms />
														<div className={'text-button'}>sms</div>
													</div>
												</div>
												<div onClick={() => onChangeTypeCB(Bind.TEL)}
													className={connectionType === Bind.TEL ?
														'button-selected' : 'button-not-selected'}>
													<div className={'icon-button'}>
														<Tel />
														<div className={'text-button'}>tel</div>
													</div>
												</div>
												<div onClick={() => { setButton(false), setInputValue(''), setConnectionType(Bind.EMAIL) }}
													className={connectionType === Bind.EMAIL ?
														'button-selected' : 'button-not-selected'}>
													<div className={'icon-button'}>
														<Email />
														<div className={'text-button'}>email</div>
													</div>
												</div>
											</div>
										</div>
										
										{connectionType === Bind.EMAIL ?
											<div className={'popup-under-input-title'}>
												{POPUP_TEXT.your_email}
											</div>
											:
											<div className={'popup-under-input-title'}>
												{POPUP_TEXT.your_phone}
											</div>
										}

										{connectionType === Bind.EMAIL ?
											<div className={'input-button'}>
												<input
													placeholder='example@email.com'
													type='email'
													value={inputValue}
													onChange={handleChange}
													className={'input-margin'} />
												<div>
													<MainButton
														title={'Уточнить стоимость'}
														isEnable={isButtonActive && inputValue !== ''}
														onClickFunction={isButtonActive ?
															() => sendEmail(inputValue, connectionType) : undefined} />
												</div>
											</div>
											:
											<div className={'input-button'}>
												<MaskedInput className={'input-margin'}
													mask={['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ',
														/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
													placeholder={'+7 (xxx) xxx-xx-xx'}
													value={inputValue}
													onChange={handleChange}
													ref={inputRef}
													onClick={onClickInput}
													onMouseDown={onClickInput}
													placeholderChar={'x'}
												/>
												<MainButton
													title={'Уточнить стоимость'}
													isEnable={isButtonActive && connectionType !== Bind.NOTHING && inputValue !== ''}
													onClickFunction={isButtonActive ?
														() => sendEmail(inputValue, connectionType) : undefined} />
											</div>
										}
									</div>
								</div>
							</div>
							:
							<div className={isMobile ? 'popup-style-success-mob' : 'popup-style-success'}>
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
						:
						<div>Загрузка</div>
				)
			}}
		</GetDistances>
	)
}
