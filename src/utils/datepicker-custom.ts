import addDays from "date-fns/addDays";


export const getWeekendNumbersByRange = (dates: IDateRange): Date[] => {

    const weekends: Date[] = [new Date()];
    weekends.pop();

    let index = 0;

    while(addDays(dates.minDate, index) <= dates.maxDate) {
        if (
            addDays(dates.minDate, index).getDay() === 6 ||
            addDays(dates.minDate, index).getDay() === 0) {
            weekends.push(addDays(dates.minDate, index));
        };
        index++;
    }

    return weekends;
}

function daysInMonth (year, month) {
    return new Date(year, month, 0).getDate();
}

export const getMaxDay = (date: Date) => {
    return daysInMonth(date.getFullYear(), date.getMonth() + 1);
}
