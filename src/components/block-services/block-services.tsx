import * as React from 'react';
import { ReactElement, memo, useCallback, useState, useRef } from 'react';
import { isMobile } from 'react-device-detect'
import { Services } from 'components/services'
import { MainButton } from 'components/main-button'
import { onOuterClickHook } from 'hooks/on-outer-click'
import Exit from './icons/exit.svg'

import './block-services.scss';


interface IBlockServicesProps {
    readonly additionalFields: ISelectedAdditionalFields,
    readonly additionalFieldsArr: IAdditionFields[]
    setAddFieldByNameCB: (name: string, value: boolean) => void,
    setInputVal: (state: string) => void
}

const BlockServicesInner: React.FC<IBlockServicesProps> = ({
    additionalFieldsArr,
    additionalFields,
    setAddFieldByNameCB,
    setInputVal
}: IBlockServicesProps): ReactElement => {

    const insuranceRef = useRef(null);
    onOuterClickHook(insuranceRef, () => setInsuranceDropped(false));

    const [inputValueInsurance, setInputValueInsurance] = useState('');
    const [isInsuranceDropped, setInsuranceDropped] = useState(true);
    const [isHoverInsurance, setHoverInsurance] = useState(false);
    const [isInsuranceDroppedMob, setInsuranceDroppedMob] = useState(true);

    const handleChangeValueInsurance = useCallback((event) => {
        setInputValueInsurance(event.target.value.replace(/[-\.;"=+?,!@<>/|~`#$%*()№:'/A-zА-яё\s]/g, '').replace(/ /g, ''));
        setInputVal(event.target.value.replace(/ /g, ''));
    }, [setInputValueInsurance, setInputVal]);

    const clickForCheck = useCallback(
        (name: string, value: boolean) => 
            (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                setAddFieldByNameCB(name, value);
        }, [additionalFields, setAddFieldByNameCB]);

    const insuranceCB = useCallback(
        (addFields: IAdditionFields) =>
            (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                if (addFields.name === 'Страхование груза') {
                    setInputVal('');
                    setInputValueInsurance('');
                    setInsuranceDroppedMob(true);
                    if (!isMobile) { setInsuranceDropped(true); }
                }
                setAddFieldByNameCB(addFields.name, !additionalFields[addFields.name]);
        }, [
            setAddFieldByNameCB,
            additionalFields,
            setInputVal,
            setInputValueInsurance,
            setInsuranceDroppedMob,
            setInsuranceDropped
        ]);

    const conditionToOpen = (addFields: IAdditionFields, additionalFields: ISelectedAdditionalFields) => {
        return (
            (!isMobile && isInsuranceDropped && additionalFields['Страхование груза'] && addFields.name === 'Страхование груза')
            ||
            (isMobile && isInsuranceDroppedMob && additionalFields['Страхование груза'] && addFields.name === 'Страхование груза')
            ||
            (!isMobile && isHoverInsurance && addFields.name === 'Страхование груза')
        );
    }

    const buttonInsuranceCB = useCallback(() => {
        setInsuranceDropped(false);
        setInsuranceDroppedMob(false);
        setInputVal(inputValueInsurance)
    }, [
        setInsuranceDropped,
        setInsuranceDroppedMob,
        setInputVal,
        inputValueInsurance,
        isInsuranceDropped,
        isInsuranceDroppedMob
    ]);

    return (
        <>
            <div className={isMobile ? 'choose-cargo-last-mob' : 'choose-cargo-last'}>
                <div className={isMobile ? 'text-before-checkbox-mob' : 'text-before-checkbox'}>
                    Дополнительно
                </div>
                <div className={isMobile ? 'choose-addFields-mob' : 'choose-addFields'}>
                    {additionalFieldsArr?.map((addFields) =>
                        <div ref={isMobile ? insuranceRef : undefined} key={addFields.id}>
                            <Services 
                                title={addFields.name}
                                insuranceCB={insuranceCB}
                                clickForCheck={clickForCheck}
                                addFields={addFields}
                                additionalFields={additionalFields}
                                setHoverInsurance={setHoverInsurance}
                            />
                            {!conditionToOpen(addFields, additionalFields) ? <></> :
                                <div className={isMobile ? 'insurance-block-mob' : 'insurance-block'}>
                                    <div className='insurance-block-content'>
                                        <div className='exit-logo-insurance'>
                                            <div onClick={insuranceCB(addFields)}>
                                                <Exit />
                                            </div>
                                        </div>
                                        <div className='insurance-block-title'>
                                            Стоимость вашего груза
                                        </div>
                                        <div className='insurance-block-input-flex'>
                                            <input
                                                value={inputValueInsurance.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ")}
                                                onChange={handleChangeValueInsurance}
                                                placeholder='Введите стоимость'
                                                className='insurance-block-input'
                                                type="text" />
                                            <div className='insurance-block-rub-text'>
                                                ₽
                                            </div>
                                        </div>
                                        <MainButton
                                            title={'Применить'}
                                            isEnable={inputValueInsurance !== ''}
                                            onClickFunction={buttonInsuranceCB} />
                                    </div>
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export const BlockServices = memo(BlockServicesInner);