import * as React from 'react';
import {useState, useEffect, memo} from 'react';
import { withYMaps } from 'react-yandex-maps';
import { RESULT_SUM_API_URL } from '../constants/api-methods';

interface getDistancesType {
    ymaps: any,
    address: string,
    pricesArr: {company: string, 'coords_lat': number, 'coords_lon': number, sum: number}[],
    children: any
}

const getDistancesUnMemo = ({ ymaps, address, pricesArr, children }: getDistancesType): any => {
    const [resultSums, setResultSums] = useState('load')

    useEffect(() => {
        ymaps.geocode(address).then((res) => {
            const cityCoords = res.geoObjects.get(0).geometry.getCoordinates(); 
            const requestPayloadPrice = pricesArr.map((price) => {
                return {
                    ...price,
                    distance: parseInt(ymaps.coordSystem.geo.getDistance(cityCoords, [price.coords_lon, price.coords_lat])) / 1000
                };
            });
            fetch(RESULT_SUM_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({prices: requestPayloadPrice})
            })
            .then(resultSumArr => resultSumArr.json())
            .then(resultSumArrParse => setResultSums(resultSumArrParse))
            .catch((err) => {
                console.log(err)
            })
        })        
    },[pricesArr, address])

    return (
        <>
            {children(resultSums)}
        </>
        );
}

const getDistancesYmaps = withYMaps<Omit<getDistancesType, 'ymaps'>>(getDistancesUnMemo, true, [
    'formatter',
    'geocode',
    'coordSystem.geo'
]);

export const GetDistances = memo(getDistancesYmaps);
