export const objectToString = (obj: ISelectedAdditionalFields): string => {

    let bufferString: string = '';

    for(let key in obj)
    {
        if(obj[key]) {
            bufferString += (key + ', ');
        }
    }

    return bufferString;

}