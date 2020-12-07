import * as React from 'react';
import { ReactElement, memo } from 'react';
import { isMobile } from 'react-device-detect';
import './choose-city.scss';
import Checked from './icons/checked.svg'
import Notchecked from './icons/notchecked.svg'

interface IChooseCityProp {
    city: string,
    isChosen: string
}

const ChooseCityInner: React.FC<IChooseCityProp> = ({
    city,
    isChosen
}: IChooseCityProp): ReactElement => {

    return (
        <div className={isMobile ? 'choose-city-mob' : 'choose-city'}>
            <div className={'city-text-pos'}>{city}</div>
            <div className={'city-checked-icon-pos'}>
                {isChosen === city ?
                    <Checked />
                    :
                    <Notchecked />
                }
            </div>
        </div>
    );
}

export const ChooseCity = memo(ChooseCityInner);
