import * as React from 'react'
import { isMobile } from 'react-device-detect'
import {
    ReactElement,
    memo,
} from 'react'
import { FOOTER_TEXT } from 'constants/footer'

import './footer.scss'


interface IFooterProps {

}

const FooterInner: React.FC<IFooterProps> = ({

}: IFooterProps): ReactElement => {

    return (
        <div className={isMobile ? 'footer-mob' : 'footer'}>
            <div className={'footer-text'}>{FOOTER_TEXT.text}</div>
            <div className={'footer-icons'}>
                {FOOTER_TEXT.icons.map((icon, index) => (
                    <div key={index}>{icon}</div>
                ))}
            </div>
        </div>
    );

}

export const Footer = memo(FooterInner);
