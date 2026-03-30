import React, { type FunctionComponent, useCallback } from 'react';

import {
    withHostedCreditCardFieldset,
    type WithInjectedHostedCreditCardFieldsetProps,
} from '../hostedCreditCard';

import CreditCardPaymentMethod, { type CreditCardPaymentMethodProps } from './CreditCardPaymentMethod';

export type PaypalCommerceCreditCardPaymentMethodProps = CreditCardPaymentMethodProps;

const PaypalCommerceCreditCardPaymentMethod: FunctionComponent<
    PaypalCommerceCreditCardPaymentMethodProps & WithInjectedHostedCreditCardFieldsetProps
> = ({
    getHostedFormOptions,
    getHostedStoredCardValidationFieldset,
    hostedFieldset,
    hostedStoredCardValidationSchema,
    hostedValidationSchema,
    initializePayment,
    ...rest
}) => {
    const initializeHostedCreditCardPayment: CreditCardPaymentMethodProps['initializePayment'] =
        useCallback(
            async (options, selectedInstrument) => {
                return initializePayment({
                    ...options,
                    paypalcommercecreditcards: {
                        form:
                            getHostedFormOptions &&
                            (await getHostedFormOptions(selectedInstrument)),
                    },
                });
            },
            [getHostedFormOptions, initializePayment],
        );

    return (
        <CreditCardPaymentMethod
            {...rest}
            cardFieldset={hostedFieldset}
            cardValidationSchema={hostedValidationSchema}
            getStoredCardValidationFieldset={getHostedStoredCardValidationFieldset}
            initializePayment={initializeHostedCreditCardPayment}
            storedCardValidationSchema={hostedStoredCardValidationSchema}
        />
    );
};

export default withHostedCreditCardFieldset(PaypalCommerceCreditCardPaymentMethod);
