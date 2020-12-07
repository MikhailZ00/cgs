import * as React from 'react'
import { ReactElement } from 'react'
import RightArrow from './icons/right-arrow.svg';
import LeftArrow from './icons/left-arrow.svg';
import { months } from 'constants/months'


interface IDatepickerHeaderProps {
    date: Date,
    decreaseMonth: () => void,
    increaseMonth: () => void
}

export const DatepickerHeader = ({
    date,
    decreaseMonth,
    increaseMonth
}: IDatepickerHeaderProps): ReactElement => {

    return (
        <div className={'datepicker-custom__header'}>
            <div onClick={decreaseMonth} className={'datepicker-custom__header-arrow'}>
                <LeftArrow />
            </div>
            <div className={'datepicker-custom__header-text'}>
                {months[date.getMonth()] + ' ' + date.getFullYear()}
            </div>
            <div onClick={increaseMonth} className={'datepicker-custom__header-arrow'}>
                <RightArrow />
            </div>
        </div>
    );
}
