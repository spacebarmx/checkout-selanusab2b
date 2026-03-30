import { type PaymentInitializeOptions } from '@bigcommerce/checkout-sdk';
import React, { type FunctionComponent, useCallback } from 'react';
import { type Omit } from 'utility-types';

import WalletButtonPaymentMethod, {
    type WalletButtonPaymentMethodProps,
} from './WalletButtonPaymentMethod';

export type CCAvenueMarsPaymentMethodProps = Omit<
    WalletButtonPaymentMethodProps,
    'buttonId' | 'shouldShowEditButton'
>;

const ChasePayPaymentMethod: FunctionComponent<CCAvenueMarsPaymentMethodProps> = ({
    initializePayment,
    ...rest
}) => {
    const initializeChasePayPayment = useCallback(
        (options: PaymentInitializeOptions) =>
            initializePayment({
                ...options,
                chasepay: {
                    walletButton: 'chaseWalletButton',
                },
            }),
        [initializePayment],
    );

    return (
        <WalletButtonPaymentMethod
            {...rest}
            buttonId="chaseWalletButton"
            initializePayment={initializeChasePayPayment}
            shouldShowEditButton
        />
    );
};

export default ChasePayPaymentMethod;
