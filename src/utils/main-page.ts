export const dateToString = (date: Date): string => {

    let day: string = date.getDay().toLocaleString();
    let month: string = date.getMonth().toLocaleString();
    const year = String(date.getFullYear());

    if(day.length === 1) {
        day = '0' + day;
    }
    if(month.length === 1) {
        month = '0' + month;
    }

    return day + '.' + month + '.' + year;

}

export const getCurrentCityCoords = (contentForRender: IBackResponse, selectedSrcCity: string): number[] => {
    if(!contentForRender) {
        return contentForRender.src_city.filter((city) => city.name === selectedSrcCity)[0].coordinates;
    }
    else
    {
        return [55.75, 37.57]
    }
}