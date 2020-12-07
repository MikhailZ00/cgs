import * as React from 'react';
import { ReactElement } from 'react';
import './services.scss';
import Checked from './icons/checked.svg'
import NotChecked from './icons/notchecked.svg'
import { isMobile } from 'react-device-detect';

interface IServicesProp {
    title: string,
    insuranceCB: (addFields: IAdditionFields) => 
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    clickForCheck: (name: string, value: boolean) => 
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    addFields: IAdditionFields,
    additionalFields: ISelectedAdditionalFields,
    setHoverInsurance: (value: boolean) => void
}

export const Services: React.FC<IServicesProp>  = (
{ 
    title,
    addFields,
    additionalFields,
    insuranceCB,
    clickForCheck,
    setHoverInsurance
}: IServicesProp):ReactElement => {

    return (
        <div className={isMobile ? 'services-comp-mob ' : 'services-comp'}>
            <div
                className={'services-checkbox'} 
                onClick={addFields.name === 'Страхование груза' ?
                    insuranceCB(addFields)
                    :
                    clickForCheck(addFields.name, !additionalFields[addFields.name])
                }
                onMouseEnter={addFields.name === 'Страхование груза' ? (() => setHoverInsurance(true)) : undefined}
                onMouseLeave={addFields.name === 'Страхование груза' ? (() => setHoverInsurance(false)) : undefined}
                >
                { additionalFields[addFields.name] ? <Checked /> : <NotChecked /> }
            </div>
            <div className={'services-text'}>
                <div 
                    className={'services-text--pointer'}
                    onClick={addFields.name === 'Страхование груза' ?
                        insuranceCB(addFields)
                        :
                        clickForCheck(addFields.name, !additionalFields[addFields.name])
                    }
                    onMouseEnter={addFields.name === 'Страхование груза' ? (() => setHoverInsurance(true)) : undefined}
                    onMouseLeave={addFields.name === 'Страхование груза' ? (() => setHoverInsurance(false)) : undefined}
                    >
                    {title}
                </div>
            </div>
        </div>
    );

}