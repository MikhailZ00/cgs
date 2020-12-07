import * as React from 'react';
import { ReactElement, useCallback, useState, memo, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { SelectItem } from 'components/select-item'
import { SelectAddress } from 'components/select-address';
import { onOuterClickHook } from 'hooks/on-outer-click'

import './dropdown-list.scss';


interface IDropdownListProp {
    isAddress: boolean,
    setId: (state: number) => void,
    setValue: (state: string) => void,
    readonly cargoTypes?: ICargoType[],
}

const DropdownListInner: React.FC<IDropdownListProp> = (
{
    setId,
    isAddress,
    setValue,
    cargoTypes
}: IDropdownListProp): ReactElement => {
    
    const dropdownRef = useRef(null);
    const [isDropped, setDropped] = useState(false);
    const [isDropDownText, setDropDownText] = useState('');
    onOuterClickHook(dropdownRef,() => setDropped(false));

    const handleChangeDropDown = useCallback((event) => {
        setDropDownText(event.target.value)
    }, [setDropDownText]);
    const onClickDropDownItem = useCallback((value: string, num: number) =>
        () => {
            setDropDownText(value);
            setDropped(false);
            setId(num);
            if (!isAddress) {
            setValue(value);}
        }, [isDropDownText, isDropped, setValue]
    );

    const filteredCargoTypes = cargoTypes
        ?.filter(cargo => cargo.name.toLowerCase()
        .includes(isDropDownText.toLowerCase()))
        .slice(0, 500);

    return (
        <div ref={dropdownRef}>
            <input
                onClick={() => { setDropped(true) }}
                placeholder={isAddress ? 'Введите адрес' : 'Введите тип груза'}
                className={isDropped ?
                    isMobile ? 'input-for-dropdown-dropped-mob' : 'input-for-dropdown-dropped'
                    :
                    isMobile ? 'input-for-dropdown-mob' : 'input-for-dropdown'}
                type="text"
                value={isDropDownText}
                onChange={handleChangeDropDown} />
            {isDropped && (
                <div key={Math.random()+'dropdownUniqueKey'} className={isMobile ? 'back-of-select-all-mob' : 
                        isAddress ? 'back-of-select-address' :'back-of-select-all'}>
                    {filteredCargoTypes?.map(
                        (cargo) => (
                            <div
                                onClick={String(cargo.id).substr(1, 3).includes('000') ? 
                                    undefined : onClickDropDownItem(cargo.name, cargo.id)}
                                key={cargo.id}
                                className={isMobile ? 'back-of-select-mob' : 'back-of-select'}
                            >
                                {isAddress ? (
                                    <SelectAddress title={cargo.name} />
                                ) : (
                                    <SelectItem number={String(cargo.id)} title={cargo.name} />
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export const DropdownList = memo(DropdownListInner);
