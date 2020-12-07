const disableTouchMove = (ref?: any) => (event) => {
	if (ref && ref.current && !ref.current.contains(event.target)) {
		event.preventDefault();
	}
};

export const disableScroll = (ref?: any) => {
	document.body.style.overflow = 'hidden';
	document.getElementsByTagName('html')[0].style.overflow = 'hidden';
	//ios
	//@ts-ignore
	window.handleDisableTouchMove = disableTouchMove(ref);
	//@ts-ignore
	document.addEventListener('touchmove', window.handleDisableTouchMove, { passive: false });
}

export const enableScroll = () => {
	document.body.style.overflow = 'auto';
	document.getElementsByTagName('html')[0].style.overflow = 'auto';
	//ios
	//@ts-ignore
	document.removeEventListener('touchmove', window.handleDisableTouchMove);
}