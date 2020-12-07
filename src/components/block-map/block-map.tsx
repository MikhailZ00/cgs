import * as React from 'react'
import { isMobile } from 'react-device-detect'
import {
    ReactElement,
    memo,
    useState,
    useCallback,
    useRef,
    useEffect
} from 'react'
import { YandexMap } from '../yandex-map'
import { MapOpen } from '../map-open'
import { MAP_BUTTON_TEXT } from 'constants/mapopen'
import { withYMaps } from 'react-yandex-maps'
import classNames from 'classnames'
import { scrollToRef } from 'core/scroll-to-element';

import './block-map.scss'


interface IBlockMapProps {
    readonly title: string,
    setAdress: (adress: string) => void,
    readonly adress: string,
    readonly id: string,
    ymaps: any,
    readonly srcCityCoords: number[]
}

const BlockMapInner: React.FC<IBlockMapProps> = ({
    title,
    setAdress,
    adress,
    id,
    ymaps,
    srcCityCoords
}: IBlockMapProps): ReactElement => {

    const [coords, setCoordsHook] = useState({ lat: 0, long: 0 });
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [placemarkProperties, setPlacemarkProperties] = useState({
        iconCaption: '',
        balloonContent: null
    });
    const inputRef = useRef(null);

    const setCoords = useCallback((coords: { lat, long }) => {
        setCoordsHook(coords);
    }, [coords]);


    const onChangeInput = useCallback((event) => {
        const searchValue = event.target.value;
        if (searchValue) {
            ymaps.geocode(searchValue, { result: 1 })
                .then((response) => {
                    const firstGeoObject = response.geoObjects.get(0),
                        coords = firstGeoObject.geometry.getCoordinates();

                    setPlacemarkProperties({
                        iconCaption: [
                            firstGeoObject.getLocalities().length ?
                                firstGeoObject.getLocalities() :
                                firstGeoObject.getAdministrativeAreas(),
                            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                        ].filter(Boolean).join(', '),
                        balloonContent: firstGeoObject.getAddressLine()
                    });

                    setCoords({ lat: coords[0], long: coords[1] });
                })
        }

    }, [adress]);

    const onClickOpen = useCallback((): void => {
        setIsMapOpen(!isMapOpen);
    }, [isMapOpen]);

    useEffect(() => {
        if (isMapOpen) {
            scrollToRef(inputRef);
        }
    }, [isMapOpen])

    useEffect(() => {
        setAdress(inputRef.current.value || '');
    });

    return (
        <>
            <div className={isMobile ? 'block-map-mobile' : 'block-map'}>
                <div className={isMobile ? 'text-before-checkbox-mob' : 'text-before-checkbox'}>{title}</div>
                <div style={isMobile ? {} : { width: '744px' }}>
                    <input
                        ref={inputRef}
                        type="text"
                        className={classNames(
                            'block-map__input--main',
                            isMobile ? 'block-map__input-mobile' : 'block-map__input')}
                        onChange={onChangeInput}
                        onBlur={onChangeInput}
                        id={id}
                        disabled={isMapOpen}
                        placeholder={'Введите адрес: '} />
                    <MapOpen
                        title={isMapOpen ? MAP_BUTTON_TEXT[1] : MAP_BUTTON_TEXT[0]}
                        onClick={onClickOpen} />
                </div>
            </div>
            <YandexMap
                setAdress={setAdress}
                setCoords={setCoords}
                coords={coords}
                setPlacemarkProperties={setPlacemarkProperties}
                placemarkProperties={placemarkProperties}
                isMapOpen={isMapOpen}
                id={id}
                refToInput={inputRef}
                onClickOpen={onClickOpen}
                srcCityCoords={srcCityCoords} />
        </>
    );

}

const BlockMapWithContext = withYMaps<Omit<IBlockMapProps, 'ymaps'>>(BlockMapInner, true, [
    'SuggestView',
    'geocode',
    'templateLayoutFactory',
]);

export const BlockMap = memo(BlockMapWithContext);
