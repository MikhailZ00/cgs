import * as React from 'react'
import { 
    Map, 
    Placemark,
    withYMaps
} from 'react-yandex-maps';
import { 
    ReactElement, 
    memo, 
    useCallback,
    useState
} from 'react'
import { isMobile } from 'react-device-detect'
import classNames from 'classnames'
import Cross from './icons/cross.svg'
import Plus from './icons/plus.svg'
import Minus from './icons/minus.svg'


import './yandex-map.scss'


interface IYandexMapProps {
    setAdress: (adress: string) => void,
    setCoords: (coords: {lat, long}) => void,
    readonly coords: {lat, long},
    setPlacemarkProperties: (iconProperty: {iconCaption, balloonContent}) => void,
    readonly placemarkProperties: {iconCaption, balloonContent},
    readonly isMapOpen: boolean,
    readonly id: string,
    refToInput: React.RefObject<HTMLInputElement>,
    ymaps: any,
    onClickOpen: () => void,
    readonly srcCityCoords: number[]
}

const YandexMapInner:React.FC<IYandexMapProps> = ({
    setAdress,
    setCoords,
    coords,
    setPlacemarkProperties,
    placemarkProperties,
    isMapOpen,
    id,
    refToInput,
    ymaps,
    onClickOpen,
    srcCityCoords
}: IYandexMapProps):ReactElement => {

    const [mapAdress, setMapAdress] = useState<string>('');
    const [mapZoom, setMapZoom] = useState<number>(10);

    const onClickMap = useCallback((event) => {
        
        const coordsGetted = event.get('coords');
        setCoords({lat: coordsGetted[0], long: coordsGetted[1]});

        setPlacemarkProperties({
            iconCaption: 'Поиск...',
            balloonContent: null
        });
        

        ymaps.geocode(coordsGetted)
        .then((response) => {
            
            const firstGeoObject = response.geoObjects.get(0);

            setPlacemarkProperties({
                iconCaption: [
                    firstGeoObject.getLocalities().length ? 
                        firstGeoObject.getLocalities() : 
                        firstGeoObject.getAdministrativeAreas(),
                    firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                ].filter(Boolean).join(', '),
                balloonContent: firstGeoObject.getAddressLine()
            });

            setMapAdress(firstGeoObject.getAddressLine());

        })

    }, [coords]);

    const onCLickMinusZoomCB = useCallback(() => {
        if(mapZoom > -1) {
            setMapZoom(mapZoom - 1);
        }
    }, [mapZoom]);

    const onCLickPlusZoomCB = useCallback(() => {
        if(mapZoom < 21) {
            setMapZoom(mapZoom + 1);
        }
    }, [mapZoom]);

    const onClickMapButton = useCallback(() => {
        onClickOpen();
        refToInput.current.value = mapAdress;
        setAdress(mapAdress);
    }, [mapAdress]);

    return(
        <div className={
            classNames(
                isMapOpen ? '' : 'yandex-map--hidden',
                isMobile ? 'yandex-map-mobile' : 'yandex-map'
            )}>
            <Map 
                defaultState={{ 
                    center: [srcCityCoords[0], srcCityCoords[1]],
                    zoom: 10,
                    controls: [],
                }}
                state={{
                    center: [srcCityCoords[0], srcCityCoords[1]],
                    zoom: mapZoom,
                    behaviors: isMobile ? 
                        ['default']
                        :
                        ['drag', 'disable("zoomScroll")']
                }}
                className={'yandex-map__map'}
                onClick={onClickMap}
                onLoad={(ymaps) => {
                    new ymaps.SuggestView(id);
                }}
                >
                    <Placemark 
                        geometry={[coords.lat, coords.long]}
                        properties={placemarkProperties}
                        options={{
                            preset: 'islands#icon'
                        }} />
                    <div 
                        className={'yandex-map__button'}
                        onClick={onClickMapButton}
                        >
                        <div className={'yandex-map__button-text'}>Подтвердить</div>
                    </div>
                    {!isMobile && 
                        <>
                            <button 
                                className={'yandex-map__button-close'}
                                onClick={onClickOpen}
                                >
                                <Cross />
                            </button>
                            <div className={'yandex-map__btns'}>
                                <button className={'yandex-map__btn-plus'} onClick={onCLickPlusZoomCB}> 
                                    <div className={'yandex-map__btn-icon'}><Plus /></div>
                                </button>
                                <button className={'yandex-map__btn-minus'} onClick={onCLickMinusZoomCB}> 
                                    <div className={'yandex-map__btn-icon'}><Minus /></div>
                                </button>
                            </div>
                        </>
                    }
            </Map>
        </div>
    );
}

export const YandexMap = withYMaps<Omit<IYandexMapProps, 'ymaps'>>(memo(YandexMapInner), true);
