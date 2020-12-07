import * as React from 'react';
import { ReactElement, memo } from 'react';
import { isMobile } from 'react-device-detect';
import './choose-type.scss';
import Checked from './icons/checked.svg'
import Notchecked from './icons/notchecked.svg'
import CheckedMob from './icons/checkedmob.svg'
import NotcheckMob from './icons/notcheckmob.svg'

interface IChooseTypeProp {
    type: string,
    description: string,
    logo: {
        'active': string,
        'inactive': string,
    },
    isChosen: string
}

const ChooseTypeInner: React.FC<IChooseTypeProp> = ({
    type,
    description,
    logo,
    isChosen
}: IChooseTypeProp): ReactElement => {

    return (
        <div className={isMobile ? 'choose-type-mob' : 'choose-type'}>
            <div>
                <div className={'type-logo-pos'}>
                    <img src={isChosen === description ? logo.active : logo.inactive} />                 
                </div>
                <div className={'type-text-pos'}>{type}</div>
                <div className={'type-description-text'}>{description}</div>
            </div>
            <div className={isMobile ? 'type-checked-icon-pos-mob' : 'type-checked-icon-pos'}>
                {isChosen === description ?
                    isMobile ? <CheckedMob /> : <Checked />
                    :
                    isMobile ? <NotcheckMob /> : <Notchecked />
                }
            </div>
        </div>
    );
}

export const ChooseType = memo(ChooseTypeInner);
