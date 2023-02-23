import { ShippingOption } from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent, memo, useCallback, useEffect, useState } from 'react';

import { EMPTY_ARRAY } from '../../common/utility';
import { Checklist, ChecklistItem } from '../../ui/form';
import { LoadingOverlay } from '../../ui/loading';
import { getCarriers } from '../carriers/getCarriers';
import GetDefaultCarriers from '../carriers/getDefaultCarriers';

import StaticShippingOption from './StaticShippingOption';

interface ShippingOptionListItemProps {
    consignmentId: string;
    shippingOption: ShippingOption;
}

const ShippingOptionListItem: FunctionComponent<ShippingOptionListItemProps> = ({
    consignmentId,
    shippingOption,
}) => {
    
    const renderLabel = useCallback(
        () => (
            <div className="shippingOptionLabel">
                <StaticShippingOption displayAdditionalInformation={true} method={shippingOption} />
            </div>
        ),
        [shippingOption],
    );

    return (
        <ChecklistItem
            htmlId={`shippingOptionRadio-${consignmentId}-${shippingOption.id}`}
            label={renderLabel}
            value={shippingOption.id}
        />
    );
};

export interface ShippingOptionListProps {
    consignmentId: string;
    customerId?: number ;
    customerGroupId?: number;
    postalCode: string;
    stateOrProvince: string;
    storeHash?: string
    inputName: string;
    isLoading: boolean;
    selectedShippingOptionId?: string;
    shippingOptions?: ShippingOption[];
    onSelectedOption(consignmentId: string, shippingOptionId: string): void;
}

const ShippingOptionsList: FunctionComponent<ShippingOptionListProps> = ({
    consignmentId,
    customerId,
    customerGroupId,
    postalCode,
    stateOrProvince,
    inputName,
    isLoading,
    shippingOptions = EMPTY_ARRAY,
    selectedShippingOptionId,
    onSelectedOption,
}) => {
    const [filteredShippingOptions, setFilteredShippingOptions] = useState<ShippingOption[]>([])

    const handleSelect = useCallback(
        (value: string) => {
            onSelectedOption(consignmentId, value);
        },
        [consignmentId, onSelectedOption],
    );
    
    const setFilterCarriers =  async () => {
        if(!shippingOptions.length) return;

        // Carriers from Bundle
        const newCarriers= await getCarriers(customerId) || []
        const bundleCarriers= pushAndFilterCarriers(newCarriers)

        // Default Carriers
        const newDefaultCarriers = await GetDefaultCarriers()
        const defaultCarriersFromDb = pushAndFilterCarriers(newDefaultCarriers)

        const allCarriers= defaultCarriersFromDb.concat(bundleCarriers)

        setFilteredShippingOptions(allCarriers)
    }
    
    useEffect( () => {
        setFilterCarriers()
    }, [postalCode, stateOrProvince])
        
    const pushAndFilterCarriers = (Carriers:string[]) =>{
        const newFilteredShipping = []

        for ( const carrierName of Carriers){

            const filteredShipping = shippingOptions.find(element=> element.description === carrierName)
            
            if(!filteredShipping) continue;
            
            const isTheStateAndSelanusasGroup = customerGroupId===570 && stateOrProvince === 'Ciudad de México'
            
            // has to be one of the selected pickup in store, has the correcto postalCode and be in the state México
            if(
                filteredShipping.description === 'Boutique Selanusa' || filteredShipping.description === 'Recoger CLS'
            ) {
                if(
                    !(postalCode==="06080" && filteredShipping.description === 'Boutique Selanusa' || postalCode==="07040" && filteredShipping.description === 'Recoger CLS')
                        || 
                    !isTheStateAndSelanusasGroup
                ) continue;
            }
                
            newFilteredShipping.push(filteredShipping)
            
        }

        return newFilteredShipping
    }

    
      return (
        <LoadingOverlay isLoading={isLoading}>
            {
                filteredShippingOptions
                    ?<Checklist
                        aria-live="polite"
                        defaultSelectedItemId={selectedShippingOptionId}
                        name={inputName}
                        onSelect={handleSelect}
                    >
                        {
                            filteredShippingOptions.map((shippingOption) => (
                                
                                <ShippingOptionListItem
                                    consignmentId={consignmentId}
                                    key={shippingOption.id}
                                    shippingOption={shippingOption}
                                />
                            ))
                            
                        }
                    </Checklist>
                    :<h4>No hay transportistas disponibles</h4>
            }
        </LoadingOverlay>
    );
};

export default memo(ShippingOptionsList);
