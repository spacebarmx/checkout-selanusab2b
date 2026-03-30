import React, { type FunctionComponent, useCallback } from 'react';
import { type Omit } from 'utility-types';

import HostedWidgetPaymentMethod, {
    type HostedWidgetPaymentMethodProps,
} from './HostedWidgetPaymentMethod';

export type KlarnaPaymentMethodProps = Omit<HostedWidgetPaymentMethodProps, 'containerId'>;

const KlarnaV2PaymentMethod: FunctionComponent<KlarnaPaymentMethodProps> = ({
    initializePayment,
    ...rest
}) => {
    const initializeKlarnaV2Payment = useCallback(
        (options) =>
            initializePayment({
                ...options,
                klarnav2: {
                    container: `#${options.methodId}Widget`,
                },
            }),
        [initializePayment],
    );

    return (
        <HostedWidgetPaymentMethod
            {...rest}
            containerId={`${rest.method.id}Widget`}
            initializePayment={initializeKlarnaV2Payment}
        />
    );
};

export default KlarnaV2PaymentMethod;
