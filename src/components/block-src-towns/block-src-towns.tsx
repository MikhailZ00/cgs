import * as React from 'react';
import { ReactElement, memo } from 'react';
import { ChooseCity } from 'components/choose-city'
import { isMobile } from 'react-device-detect'


interface IBlockSrcTownsProps {
    setScrCityCB: (name: string) => 
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    readonly cityChecked: string,
    readonly srcCity: ISrcCity[]
}

const BlockSrcTownsInner: React.FC<IBlockSrcTownsProps> = ({
    setScrCityCB,
    cityChecked,
    srcCity
}: IBlockSrcTownsProps): ReactElement => {
    
    return (
        <>
            <div className={isMobile ? 'text-before-checkbox-mob' : 'text-before-checkbox'}>
                Город отправления *
            </div>
            <div className={isMobile ? 'city-party-checkbox-mob' : 'city-party-checkbox'}>
                {srcCity?.map((city) =>
                    <div key={city.id} onClick={setScrCityCB(city.name)}>
                        <ChooseCity city={city.name} isChosen={cityChecked} />
                    </div>
                )}
            </div>
        </>
    );
}

export const BlockSrcTowns = memo(BlockSrcTownsInner);
