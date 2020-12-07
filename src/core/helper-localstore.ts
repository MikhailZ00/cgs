export const getToLocalStorage = () : string => {
    return 'popup-style';
    // for future
    const key = 'popupStyle';
    const fromLocalStorage = localStorage.getItem('popupStyle');
    if (fromLocalStorage) {
        return fromLocalStorage;
    }
    const randomStyle = Math.random() > 0.5 ? 'small-popup-style' : 'popup-style';
    localStorage.setItem(key, randomStyle);
    return randomStyle;
}
