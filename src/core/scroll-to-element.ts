import { isMobile } from 'react-device-detect'
export const scrollErrorElement = (className: string) => {
    const el = document.getElementsByClassName(className)[0];
    if(el) {
        window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - window.innerHeight/2);
    }
}

export const scrollToRef = (ref) => {
    if(ref.current) {
       window.scrollTo(0, ref.current.offsetTop)
    }
};  
