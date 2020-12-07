import { useEffect } from 'react'


export function onOuterClickHook(ref : any, callback : () => void): void {
    useEffect(() => {
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
			callback();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
    }, [ref]);
} 
