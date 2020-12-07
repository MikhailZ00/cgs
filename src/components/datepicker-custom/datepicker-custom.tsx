import * as React from 'react';
import { ReactElement, memo, useState, useCallback } from 'react';
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import addDays from 'date-fns/addDays';
import { DatepickerHeader } from '../datepicker-header';
import { getWeekendNumbersByRange, getMaxDay } from 'utils/datepicker-custom';
import { isMobile } from 'react-device-detect';
import { CALENDAR_ICON } from './icons/calendar';

import "react-datepicker/dist/react-datepicker.css";
import './datepicker-custom.scss';

interface IDatepickerCustomProp {
    setDate: (newDate: Date) => void,
    readonly selectedDate: Date
}

const DatepickerCustomInner: React.FC<IDatepickerCustomProp> = (
    {
        setDate,
        selectedDate
    }: IDatepickerCustomProp): ReactElement => {

    registerLocale("ru_RU", ru);

    const [selectedDateRange, setSelectedDateRange] = useState<IDateRange>({
        minDate: addDays(new Date(), 1),
        maxDate: addDays(new Date(), getMaxDay(new Date()) - new Date().getDate() || 30)
    });
    const highlightWithRanges = [
        {
            "react-datepicker__day--highlighted-custom-15": getWeekendNumbersByRange(selectedDateRange),
        }
    ];

    const onMonthChange = useCallback((...args: Date[]): void => {

        const selectedDate: Date = args[0];

        if (!(selectedDate <= new Date())) {
            setSelectedDateRange({
                minDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
                maxDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), getMaxDay(selectedDate)),
            });
        }
        if (
            selectedDate.getFullYear() === new Date().getFullYear() &&
            selectedDate.getMonth() === new Date().getMonth()
        ) {
            setSelectedDateRange({
                minDate: addDays(new Date(), 1),
                maxDate: addDays(new Date(), getMaxDay(new Date()) - new Date().getDate()),
            });
        }

    }, [selectedDateRange]);

    return (
        <>
            <svg style={{ display: 'none' }}>
                <symbol id='user'>
                    <g>
                        <path id='user' d={CALENDAR_ICON[0]} fill="#00ACC1" />
                        <path d={CALENDAR_ICON[1]} fill="#00ACC1" />
                        <path d={CALENDAR_ICON[2]} fill="#00ACC1" />
                        <path d={CALENDAR_ICON[3]} fill="#00ACC1" />
                    </g>
                </symbol>
            </svg>

            <div>
                <DatePicker
                    selected={selectedDate}
                    closeOnScroll={false}
                    onChange={setDate}
                    onMonthChange={onMonthChange}
                    inline={isMobile ? false : true}
                    calendarClassName="datepicker-custom"
                    minDate={selectedDateRange.minDate}
                    maxDate={selectedDateRange.maxDate}
                    renderCustomHeader={DatepickerHeader}
                    placeholderText={'Выберите дату'}
                    locale="ru_RU"
                    disabledKeyboardNavigation
                    tabIndex={0}
                    dateFormat="dd/MM/yyyy"
                    highlightDates={highlightWithRanges}
                    openToDate={selectedDate}
                />
                {isMobile &&
                    <div >
                        <svg className='input__icon'>
                            <use xlinkHref='#user' />
                        </svg>
                    </div>
                }
            </div>
        </>
    );
}

export const DatepickerCustom = memo(DatepickerCustomInner);
