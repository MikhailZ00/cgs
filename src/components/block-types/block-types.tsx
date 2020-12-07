import * as React from 'react';
import { 
    ReactElement, 
    memo 
} from 'react';
import { isMobile } from 'react-device-detect'
import { ChooseType } from 'components/choose-type'


interface IBlockTypesProps {
    setVanTypeCB: (name: string) => 
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    readonly vanTypeChecked: string,
    readonly containerType: IContainerType[]
}

const BlockTypesInner: React.FC<IBlockTypesProps> = ({
    setVanTypeCB,
    vanTypeChecked,
    containerType
}: IBlockTypesProps): ReactElement => {
    
    return (
        <>
            <div className={isMobile ? 'text-before-checkbox-mob' : 'text-before-checkbox'}>
                    Тип размер контейнера *
            </div>
            <div className={isMobile ? 'type-party-checkbox-mob' : 'type-party-checkbox'}>
                {containerType?.map((container) =>
                    <div
                        key={container.id}
                        onClick={setVanTypeCB(container.name)}>
                        <ChooseType
                            type={'Универсальный контейнер'}
                            logo={container.image}
                            description={container.name}
                            isChosen={vanTypeChecked} />
                    </div>
                )}
            </div>
        </>
    );
}

export const BlockTypes = memo(BlockTypesInner);
