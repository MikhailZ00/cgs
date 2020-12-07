export const disableScroll = ():void => {
    document.body.style.overflow = 'hidden';
    document.getElementsByTagName('html')[0].style.overflow = 'hidden';
    document.addEventListener('touchmove', onTouchMove, { passive: false });
}

export const enableScroll = ():void => {
    document.body.style.overflow = 'auto';
    document.getElementsByTagName('html')[0].style.overflow = 'auto';
    document.removeEventListener('touchmove', onTouchMove);
}

const onTouchMove = (event) => {
    event.preventDefault();
};
