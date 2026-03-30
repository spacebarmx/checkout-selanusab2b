import React, { type FunctionComponent } from 'react';

import HostedWidgetPaymentMethod, {
    type HostedWidgetPaymentMethodProps,
} from './HostedWidgetPaymentMethod';

export type BarclaycardPaymentMethodProps = Omit<HostedWidgetPaymentMethodProps, 'containerId'>;

const BarclaycardPaymentMethod: FunctionComponent<BarclaycardPaymentMethodProps> = (props) => {
    const { method } = props;
    const containerId = `${method.id}-container`;

    return (
        <HostedWidgetPaymentMethod {...props} containerId={containerId} hideVerificationFields />
    );
};

export default BarclaycardPaymentMethod;
