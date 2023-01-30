import { ShippingOption } from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent, memo, useCallback, useEffect, useState } from 'react';

import { EMPTY_ARRAY } from '../../common/utility';
import { Checklist, ChecklistItem } from '../../ui/form';
import { LoadingOverlay } from '../../ui/loading';
import { getCarriers } from '../carriers/getCarriers';

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
    inputName,
    isLoading,
    shippingOptions = EMPTY_ARRAY,
    selectedShippingOptionId,
    onSelectedOption,
}) => {
    const handleSelect = useCallback(
        (value: string) => {
            onSelectedOption(consignmentId, value);
        },
        [consignmentId, onSelectedOption],
    );
    const [carriersNames, setCarriersNames] = useState<string[]>([])
    
    const settingCarriers =async () =>{ 
        const newCarriers= await getCarriers(customerId) || []
        
        setCarriersNames(newCarriers)
    }
    
    useEffect( () => {
        
        if(carriersNames.length===0) { 
            settingCarriers()
        }
      
    }, [carriersNames])

    if (!shippingOptions.length) {
        return null;
    }
    
    const filteredShippingOptions: ShippingOption []= []
    
    for  ( const carrierName of carriersNames){
        
        const filteredShipping= shippingOptions.find(element=> element.description === carrierName)

        if(filteredShipping) filteredShippingOptions.push(filteredShipping)
        
    }
    
    // CLS and Isabel postal code

    if((postalCode==="07040" || postalCode==="06080") && customerGroupId===20 ){

        const store= postalCode==="07040"
            ? "Recoger CLS"
            : postalCode==="06080"
                ? "Boutique Selanusa"
                :""
        
        const postalCodeFilteringShipping= shippingOptions.find(element=> element.description === store)
        
        if(postalCodeFilteringShipping)
            filteredShippingOptions.push(postalCodeFilteringShipping)

    }

      return (
        <LoadingOverlay isLoading={isLoading}>
            <Checklist
                aria-live="polite"
                defaultSelectedItemId={selectedShippingOptionId}
                name={inputName}
                onSelect={handleSelect}
            >
                {filteredShippingOptions.map((shippingOption) => (
                    
                    <ShippingOptionListItem
                        consignmentId={consignmentId}
                        key={shippingOption.id}
                        shippingOption={shippingOption}
                    />
                ))}
            </Checklist>
        </LoadingOverlay>
    );
};

export default memo(ShippingOptionsList);
